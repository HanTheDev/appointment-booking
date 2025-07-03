from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    # reuses name and email on UserBase
    # avoid sending passwords
    pass

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class config:
        orm_mode = True