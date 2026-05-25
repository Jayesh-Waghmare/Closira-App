from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class CreateEnquiryRequest(BaseModel):
    customer_name: str = Field(..., min_length=1)
    channel: Literal["whatsapp", "email", "call"]
    message: str = Field(..., min_length=1)


class CreateFollowUpRequest(BaseModel):
    delay_minutes: int = Field(..., ge=1)
    message_template: Optional[str] = None


class EscalateRequest(BaseModel):
    reason: str = Field(..., min_length=1)


class CreateEnquiryResponse(BaseModel):
    job_id: str
    status: str
    created_at: datetime


class FollowUpResponse(BaseModel):
    id: str
    enquiry_id: str
    scheduled_at: datetime
    message_template: Optional[str] = None
    status: str
    created_at: datetime


class EscalateResponse(BaseModel):
    id: str
    status: str
    escalation_reason: str
    updated_at: datetime


class TimelineEventSchema(BaseModel):
    id: int
    enquiry_id: str
    event_type: str
    description: str
    metadata: Optional[str] = Field(None, alias="event_metadata")
    created_at: datetime

    model_config = {"from_attributes": True, "populate_by_name": True}


class EnquiryDetail(BaseModel):
    id: str
    customer_name: str
    channel: str
    message: str
    status: str
    sop_matched: Optional[str]
    suggested_response: Optional[str]
    escalation_reason: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class EnquiryHistoryResponse(BaseModel):
    enquiry: EnquiryDetail
    timeline: List[TimelineEventSchema]


class HealthResponse(BaseModel):
    status: str
    db: str
    timestamp: datetime
