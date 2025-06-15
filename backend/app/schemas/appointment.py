from pydantic import BaseModel
from datetime import datetime

class AppointmentBase(BaseModel):
    user_id: int
    service_id: int
    appointment_time: datetime

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int

    class Config:
        orm_mode = True