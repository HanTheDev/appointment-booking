from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.appointment import AppointmentCreate, AppointmentResponse
from app.crud import appointment as appointment_crud

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=AppointmentResponse)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    return appointment_crud.create_appointment(db, appointment)

@router.get("/", response_model=list[AppointmentResponse])
def read_appointments(db: Session = Depends(get_db)):
    return appointment_crud.get_appointments(db)