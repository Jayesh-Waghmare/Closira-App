import json
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from models import Enquiry, FollowUp, TimelineEvent

def current_time():
    return datetime.now(timezone.utc)

def generate_id(prefix="enq"):
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

def create_enquiry(db: Session, customer_name: str, channel: str, message: str):
    new_enq = Enquiry(
        id=generate_id("enq"),
        customer_name=customer_name,
        channel=channel,
        message=message,
        status="new",
    )
    db.add(new_enq)
    db.commit()
    db.refresh(new_enq)
    return new_enq

def get_enquiry(db: Session, enquiry_id: str):
    return db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

def update_enquiry_sop(
    db: Session,
    enquiry_id: str,
    status: str,
    sop_matched: str = None,
    suggested_response: str = None,
    escalation_reason: str = None,
):
    db.query(Enquiry).filter(Enquiry.id == enquiry_id).update(
        {
            "status": status,
            "sop_matched": sop_matched,
            "suggested_response": suggested_response,
            "escalation_reason": escalation_reason,
            "updated_at": current_time(),
        }
    )
    db.commit()

def update_enquiry_escalation(db: Session, enquiry_id: str, reason: str):
    db.query(Enquiry).filter(Enquiry.id == enquiry_id).update(
        {
            "status": "escalated",
            "escalation_reason": reason,
            "updated_at": current_time(),
        }
    )
    db.commit()
    return get_enquiry(db, enquiry_id)

def append_timeline_event(db: Session, enquiry_id: str, event_type: str, description: str, metadata: dict = None):
    meta_str = json.dumps(metadata) if metadata else None
    
    event = TimelineEvent(
        enquiry_id=enquiry_id,
        event_type=event_type,
        description=description,
        event_metadata=meta_str,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

def get_timeline_events(db: Session, enquiry_id: str):
    return (
        db.query(TimelineEvent)
        .filter(TimelineEvent.enquiry_id == enquiry_id)
        .order_by(TimelineEvent.created_at.asc())
        .all()
    )

def create_follow_up(db: Session, enquiry_id: str, scheduled_at: datetime, message_template: str = None):
    fu = FollowUp(
        id=generate_id("fu"),
        enquiry_id=enquiry_id,
        scheduled_at=scheduled_at,
        message_template=message_template,
        status="pending",
    )
    db.add(fu)
    db.commit()
    db.refresh(fu)
    return fu
