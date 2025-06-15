from pydantic import BaseModel

class ServiceBase(BaseModel):
    name: str
    description: str

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int

    class config:
        orm_mode = True