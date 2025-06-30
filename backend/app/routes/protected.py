# This file defines protected routes that require user authentication.
# The `/profile` route returns the currently authenticated user's information.
# It uses the `get_current_user` dependency to extract and validate the JWT token.

from fastapi import APIRouter, Depends
from app.models.user import User
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.get("/profile")
def read_profile(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "name": current_user.name,
        "id": current_user.id,
    }