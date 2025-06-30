# seed the database with admin role first

from app.database import SessionLocal
from app.models.user import User
from app.models.appointment import Appointment  # 👈 make sure this is imported!
from app.models.service import Service  # just in case it's needed too
from app.utils.security import hash_password

db = SessionLocal()

admin = User(
    name="admin",
    email="admin@example.com",
    hashed_password=hash_password("admin123"),
    role="admin"
)

db.add(admin)
db.commit()
db.refresh(admin)

print("Admin user created:", admin)