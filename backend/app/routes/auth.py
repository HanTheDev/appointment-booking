# This file defines the /login endpoint.
# It handles user login by validating credentials and returning a JWT access token.
# The token can be used for accessing protected routes.

from fastapi import APIRouter, Depends, HTTPException
from app.schemas.login import LoginRequest
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.services import auth as auth_service
from app.utils.token import create_access_token

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
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }