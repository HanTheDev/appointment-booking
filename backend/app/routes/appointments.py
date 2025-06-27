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
def read_appointments(skip: int = 0, limit: int = 5, user_id: int | None = None, 
                      service_id: int | None = None, date: str | None = None, db: Session = Depends(get_db)):
    return appointment_crud.get_appointments(db, skip=skip, limit=limit, 
                                             user_id=user_id, service_id=service_id, date=date)

@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment_by_id(appointment_id: int, db: Session = Depends(get_db)):
    return appointment_crud.get_appointment_by_id(db, appointment_id)

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    return appointment_crud.delete_appointment(db, appointment_id)