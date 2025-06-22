from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.service import ServiceResponse

class AppointmentBase(BaseModel):
    user_id: int
    service_id: int
    appointment_time: datetime

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int
    appointment_time: datetime
    created_at: datetime
    user: UserResponse
    service: ServiceResponse

    class Config:
        orm_mode = True