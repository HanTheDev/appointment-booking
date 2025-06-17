from pydantic import BaseModel
from datetime import datetime

class ServiceBase(BaseModel):
    name: str
    description: str

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime

    class config:
        orm_mode = True