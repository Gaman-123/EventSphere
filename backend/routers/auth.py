from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from database import get_db
import asyncpg
from utils.auth import verify_password
import os

router = APIRouter(prefix="/api/admin", tags=["auth"])

class AdminLogin(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(data: AdminLogin, conn: asyncpg.Connection = Depends(get_db)):
    # Find admin by email
    row = await conn.fetchrow("SELECT id, email, password_hash FROM admins WHERE email = $1", data.email)
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(data.password, row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Return the admin key that the application expects
    return {
        "access_token": os.getenv("ADMIN_API_KEY"),
        "token_type": "bearer",
        "admin": {
            "id": row["id"],
            "email": row["email"]
        }
    }
