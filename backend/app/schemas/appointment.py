from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.service import ServiceResponse
from typing import Optional

class AppointmentBase(BaseModel):
    service_id: int
    appointment_time: datetime

class AppointmentCreate(AppointmentBase):
    user_id: Optional[int] = None

class AppointmentUpdate(BaseModel):
    service_id: Optional[int] = None
    appointment_time: Optional[datetime] = None

class AppointmentResponse(AppointmentBase):
    id: int
    appointment_time: datetime
    created_at: datetime
    user: UserResponse
    service: ServiceResponse

    class Config:
        orm_mode = True