from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

import crud
import models
import tasks
from database import Base, SessionLocal, engine, get_db
from logging_config import get_logger
from schemas import (
    CreateEnquiryRequest,
    CreateEnquiryResponse,
    CreateFollowUpRequest,
    EnquiryHistoryResponse,
    EscalateRequest,
    EscalateResponse,
    FollowUpResponse,
    HealthResponse,
    TimelineEventSchema,
    EnquiryDetail,
)

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("db is ready", extra={"event": "startup", "enquiry_id": None, "detail": None})
    yield


app = FastAPI(
    title="Closira API",
    description="Backend for the Closira MVP. Handles leads and escalations.",
    version="0.1.0",
    lifespan=lifespan,
)


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    logger.exception("Something broke", extra={"event": "internal_error", "detail": str(exc)})
    return JSONResponse(status_code=500, content={"message": "Oops, server error."})


def run_sop_bg(enq_id: str, msg_text: str):
    db = SessionLocal()
    try:
        tasks.run_sop_matching(enq_id, msg_text, db)
    finally:
        db.close()


@app.post(
    "/enquiry",
    status_code=201,
    response_model=CreateEnquiryResponse,
    description="Accepts a new enquiry from a customer and kicks off the SOP matching in the background.",
)
def create_new_enquiry(
    req_data: CreateEnquiryRequest,
    bg_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    new_enq = crud.create_enquiry(db, req_data.customer_name, req_data.channel, req_data.message)

    crud.append_timeline_event(
        db,
        new_enq.id,
        "created",
        f"Enquiry came in via {req_data.channel}.",
        {"channel": req_data.channel},
    )

    bg_tasks.add_task(run_sop_bg, new_enq.id, req_data.message)

    logger.info(
        "got a new enquiry",
        extra={"event": "enquiry_created", "enquiry_id": new_enq.id, "detail": req_data.channel},
    )

    return CreateEnquiryResponse(
        job_id=new_enq.id,
        status=new_enq.status,
        created_at=new_enq.created_at,
    )


@app.post(
    "/enquiry/{enquiry_id}/follow-up",
    status_code=201,
    response_model=FollowUpResponse,
    description="Schedule a follow-up for later.",
)
def setup_follow_up(
    enquiry_id: str,
    payload: CreateFollowUpRequest,
    db: Session = Depends(get_db),
):
    enq = crud.get_enquiry(db, enquiry_id)
    if not enq:
        raise HTTPException(status_code=404, detail="Could not find that enquiry")

    run_time = datetime.now(timezone.utc) + timedelta(minutes=payload.delay_minutes)
    fu = crud.create_follow_up(db, enquiry_id, run_time, payload.message_template)

    crud.append_timeline_event(
        db,
        enquiry_id,
        "follow_up_scheduled",
        f"Scheduled to follow up in {payload.delay_minutes} mins.",
        {"delay_minutes": payload.delay_minutes, "fu_id": fu.id},
    )

    return fu


@app.post(
    "/enquiry/{enquiry_id}/escalate",
    response_model=EscalateResponse,
    description="Manually push this to a human agent.",
)
def escalate_issue(
    enquiry_id: str,
    payload: EscalateRequest,
    db: Session = Depends(get_db),
):
    enq = crud.get_enquiry(db, enquiry_id)
    if not enq:
        raise HTTPException(404, "Enquiry missing")

    updated_enq = crud.update_enquiry_escalation(db, enquiry_id, payload.reason)

    crud.append_timeline_event(
        db,
        enquiry_id,
        "escalated",
        f"Escalated manually: {payload.reason}",
        {"reason": payload.reason},
    )

    logger.info("Escalated manually", extra={"event": "escalation_triggered", "enquiry_id": enquiry_id})

    return updated_enq


@app.get(
    "/enquiry/{enquiry_id}/history",
    response_model=EnquiryHistoryResponse,
    description="Get the full timeline of what happened with this enquiry.",
)
def fetch_history(enquiry_id: str, db: Session = Depends(get_db)):
    enq = crud.get_enquiry(db, enquiry_id)
    if not enq:
        raise HTTPException(404, "Not found")

    timeline = crud.get_timeline_events(db, enquiry_id)

    return {
        "enquiry": enq,
        "timeline": timeline,
    }


@app.get("/health", response_model=HealthResponse)
def check_health(db: Session = Depends(get_db)):
    try:
        db.execute(models.Enquiry.__table__.select().limit(1))
        db_status = "connected"
    except Exception:
        db_status = "error"

    return {
        "status": "ok",
        "db": db_status,
        "timestamp": datetime.now(timezone.utc),
    }
