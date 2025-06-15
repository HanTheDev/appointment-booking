from sqlalchemy.orm import Session
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate

def create_appointment(db: Session, appointment: AppointmentCreate):
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