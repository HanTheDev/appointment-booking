from sqlalchemy.orm import Session
from app.models.service import Service
from app.schemas.service import ServiceCreate
from fastapi import HTTPException

def create_service(db: Session, service: ServiceCreate):
    db_service = Service(name=service.name, description=service.description)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def get_services(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Service).offset(skip).limit(limit).all()

def get_service_by_id(db: Session, service_id: int):
    service = db.query(Service).filter(Service.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

def update_service(db: Session, service_id: int, updated_service: ServiceCreate):
    service = get_service_by_id(db, service_id)
    service.name = updated_service.name
    service.description = updated_service.description
    db.commit()
    db.refresh(service)
    return service

def delete_service(db: Session, service_id: int):
    service = get_service_by_id(db, service_id)
    db.delete(service)
    db.commit()
    return service