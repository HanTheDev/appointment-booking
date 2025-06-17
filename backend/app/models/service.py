from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from sqlalchemy.sql import func

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())