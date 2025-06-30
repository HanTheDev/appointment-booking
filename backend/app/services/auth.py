from app.models.user import User
from app.utils import security
from fastapi import HTTPException

def get_user_by_email(db, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db, email, password):
    user = get_user_by_email(db, email)
    if not user or not security.verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user