from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse
from app.crud import user as user_crud
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user)

@router.get("/", response_model=list[UserResponse])
def read_users(db: Session = Depends(get_db)):
    return user_crud.get_users(db)

@router.delete("/{user_id}", response_model=UserResponse)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return user_crud.delete_user(db, user_id)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, updated_user: UserCreate, db: Session = Depends(get_db)):
    return user_crud.update_user(db, user_id, updated_user)