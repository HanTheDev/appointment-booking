# This file handles password hashing and verification using bcrypt.
# - `hash_password`: hashes a plain-text password for storage
# - `verify_password`: checks if a given password matches the stored hash

import bcrypt

def hash_password(plain_password: str) -> str:
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))