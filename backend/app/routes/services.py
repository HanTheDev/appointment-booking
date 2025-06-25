from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.service import ServiceCreate, ServiceResponse
from app.crud import service as service_crud

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    return service_crud.create_service(db, service)

@router.get("/", response_model=list[ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return service_crud.get_services(db)

@router.get("/{service_id}", response_model=ServiceResponse)
def get_service_by_id(service_id: int, db: Session = Depends(get_db)):
    return service_crud.get_service_by_id(db, service_id)

@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(service_id: int, updated_service: ServiceCreate, db: Session = Depends(get_db)):
    return service_crud.update_service(db, service_id, updated_service)

@router.delete("/{service_id}", response_model=ServiceResponse)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    return service_crud.delete_service(db, service_id)