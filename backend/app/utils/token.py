# This file handles JWT token creation.
# It generates access tokens containing user information (usually email as 'sub').
# These tokens are returned after login and used to access protected routes.

from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "cobain-123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

