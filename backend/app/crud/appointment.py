from sqlalchemy.orm import Session, joinedload
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
    return (
        db.query(Appointment)
        .options(joinedload(Appointment.user), joinedload(Appointment.service))
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_appointment_by_id(db: Session, appointment_id: int):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

def delete_appointment(db: Session, appointment_id: int):
    appointment = get_appointment_by_id(db, appointment_id)
    db.delete(appointment)
    db.commit()
    return {"msg": "Appointment deleted successfully"}  