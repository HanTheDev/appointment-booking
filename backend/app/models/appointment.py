from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    appointment_time = Column(DateTime)

    user = relationship("User")
    service = relationship("Service")