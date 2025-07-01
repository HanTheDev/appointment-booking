from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.appointment import AppointmentCreate, AppointmentResponse
from app.crud import appointment as appointment_crud
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=AppointmentResponse)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        user_id = appointment.user_id
    else:
        user_id = current_user.id

    return appointment_crud.create_appointment(db, appointment, user_id)

@router.get("/", response_model=list[AppointmentResponse])
def read_appointments(skip: int = 0, limit: int = 5, user_id: int | None = None, 
                      service_id: int | None = None, date: str | None = None, 
                      current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return appointment_crud.get_appointments(db, skip=skip, limit=limit, 
                                             user_id=user_id, service_id=service_id, date=date)

@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment_by_id(appointment_id: int, db: Session = Depends(get_db)):
    return appointment_crud.get_appointment_by_id(db, appointment_id)

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    return appointment_crud.delete_appointment(db, appointment_id)