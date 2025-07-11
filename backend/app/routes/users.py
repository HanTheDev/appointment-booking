from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.crud import user as user_crud
from app.database import SessionLocal
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.schemas.password import PasswordUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create users")
    return user_crud.create_user(db, user)

@router.get("/", response_model=list[UserResponse])
def read_users(current_user: User = Depends(get_current_user), 
               skip: int = 0, limit: int = 5, db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user_crud.get_users(db, skip, limit)

@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    return user_crud.get_user_by_id(db, user_id)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, updated_user: UserUpdate, db: Session = Depends(get_db)):
    return user_crud.update_user(db, user_id, updated_user)

@router.delete("/{user_id}", response_model=UserResponse)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return user_crud.delete_user(db, user_id)

@router.get("/email/{email}", response_model=UserResponse)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}/change-password")
def change_password(user_id: int, password_data: PasswordUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔐 Verify current password
    from app.utils.security import verify_password, hash_password
    if not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    # 💾 Update to new password
    user.hashed_password = hash_password(password_data.new_password)
    db.commit()
    return {"msg": "Password updated successfully"}