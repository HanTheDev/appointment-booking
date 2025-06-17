from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class config:
        orm_mode = True