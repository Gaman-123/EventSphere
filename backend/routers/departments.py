from fastapi import APIRouter, Depends
from database import get_db
import asyncpg
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/departments", tags=["departments"])

class Department(BaseModel):
    id: int
    name: str

@router.get("/", response_model=List[Department])
async def get_departments(db: asyncpg.Connection = Depends(get_db)):
    rows = await db.fetch("SELECT id, name FROM departments ORDER BY id ASC")
    return [dict(row) for row in rows]
