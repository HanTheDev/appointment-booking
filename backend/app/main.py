from fastapi import FastAPI
from app.routes import users, services, appointments
from app.database import Base, engine
from app.models import user, service, appointment
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Appointment Booking API")

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(services.router, prefix="/services", tags=["Services"])
app.include_router(appointments.router, prefix="/appointments", tags=["Appointments"])
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Booking Appointment API"}