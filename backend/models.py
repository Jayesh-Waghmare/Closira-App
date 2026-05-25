import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from database import Base


def _short_uuid() -> str:
    return f"enq_{uuid.uuid4().hex[:8]}"


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Text, primary_key=True, default=_short_uuid)
    customer_name = Column(Text, nullable=False)
    channel = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(Text, nullable=False, default="new")
    sop_matched = Column(Text, nullable=True)
    suggested_response = Column(Text, nullable=True)
    escalation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now)

    timeline_events = relationship(
        "TimelineEvent", back_populates="enquiry", cascade="all, delete-orphan"
    )
    follow_ups = relationship(
        "FollowUp", back_populates="enquiry", cascade="all, delete-orphan"
    )


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    enquiry_id = Column(Text, ForeignKey("enquiries.id"), nullable=False)
    event_type = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    event_metadata = Column("metadata", Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now)

    enquiry = relationship("Enquiry", back_populates="timeline_events")


class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(Text, primary_key=True, default=lambda: f"fu_{uuid.uuid4().hex[:8]}")
    enquiry_id = Column(Text, ForeignKey("enquiries.id"), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    message_template = Column(Text, nullable=True)
    status = Column(Text, nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), default=_now)

    enquiry = relationship("Enquiry", back_populates="follow_ups")
