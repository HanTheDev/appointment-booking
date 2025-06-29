from fastapi import APIRouter, Depends, HTTPException
from app.schemas.login import LoginRequest
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.services import auth as auth_service

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login_user(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, credentials.email, credentials.password)
    return {
        "message": "Login successful",
        "user_id": user.id,
        "email": user.email,
        "name": user.name,
    }