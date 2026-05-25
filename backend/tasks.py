from datetime import datetime
from sqlalchemy.orm import Session
import crud
from logging_config import get_logger

logger = get_logger(__name__)

SOP_RULES = [
    (
        "Booking Enquiry",
        ["book", "appointment", "schedule", "reserve", "slot"],
        "Hey there, I can get you on the schedule. What times usually work best for you?"
    ),
    (
        "Pricing Question",
        ["price", "cost", "how much", "rate", "quote", "fee"],
        "Hey, pricing depends on exactly what you need done. Give me a bit more context and I can send over a rough estimate."
    ),
    (
        "Complaint",
        ["unhappy", "complaint", "dissatisfied", "refund", "issue", "problem", "worst", "bad"],
        "Hey, I saw your message. I want to get this fixed for you right away. Give me a few minutes to look into what happened and I'll get back to you."
    ),
    (
        "General Information",
        ["info", "details", "tell me", "how does", "what is"],
        "Hey! Happy to share more details. Is there a specific part of the service you're wondering about?"
    ),
]

def check_after_hours():
    h = datetime.now().hour
    return h >= 20 or h < 8

def find_matching_sop(msg_text: str):
    text_lower = msg_text.lower()
    
    for name, keywords, response in SOP_RULES:
        for kw in keywords:
            if kw in text_lower:
                return name, response
                
    after_hours_kws = ["closed", "after hours", "tomorrow", "unavailable"]
    if check_after_hours() or any(kw in text_lower for kw in after_hours_kws):
        return "After-Hours Message", "Hey, we're currently closed for the day. I've flagged your message and someone will get back to you first thing in the morning."

    return None, None

def run_sop_matching(enquiry_id: str, message: str, db: Session):
    logger.info("Starting SOP matching", extra={"event": "task_started", "enquiry_id": enquiry_id})

    crud.update_enquiry_sop(db, enquiry_id, status="processing")
    
    sop_name, canned_response = find_matching_sop(message)

    if sop_name:
        crud.update_enquiry_sop(
            db,
            enquiry_id,
            status="sop_matched",
            sop_matched=sop_name,
            suggested_response=canned_response,
        )
        crud.append_timeline_event(
            db,
            enquiry_id,
            "sop_matched",
            f"SOP '{sop_name}' matched. Suggested response generated.",
            {"sop": sop_name},
        )
        logger.info("SOP matched successfully", extra={"event": "sop_matched", "enquiry_id": enquiry_id, "detail": sop_name})
    else:
        crud.update_enquiry_sop(db, enquiry_id, status="escalated", escalation_reason="No SOP matched")
        crud.append_timeline_event(
            db,
            enquiry_id,
            "escalated",
            "No SOP matched. Enquiry auto-escalated.",
            {"reason": "No SOP matched"},
        )
        logger.warning("No SOP matched, escalating", extra={"event": "sop_no_match", "enquiry_id": enquiry_id, "detail": "Auto-escalated"})
