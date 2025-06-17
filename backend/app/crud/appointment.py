from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate
from fastapi import HTTPException
from app.models.user import User
from app.models.service import Service

def create_appointment(db: Session, appointment: AppointmentCreate):
    user = db.query(User).filter(User.id == appointment.user_id).first()
    service = db.query(Service).filter(Service.id == appointment.service_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db_appointment = Appointment(
        user_id=appointment.user_id,
        service_id=appointment.service_id,
        appointment_time=appointment.appointment_time
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointments(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Appointment).offset(skip).limit(limit).all()