from fastapi import APIRouter, Depends
from database import get_db
import asyncpg
from typing import List
from pydantic import BaseModel
from middleware.auth import get_admin_key

router = APIRouter(prefix="/api/venues", tags=["venues"])

class VenueBase(BaseModel):
    name: str
    capacity: int

class VenueCreate(VenueBase):
    pass

class Venue(VenueBase):
    id: int
    is_active: bool

@router.get("/", response_model=List[Venue])
async def get_venues(db: asyncpg.Connection = Depends(get_db)):
    rows = await db.fetch("SELECT id, name, capacity, is_active FROM venue ORDER BY id ASC")
    return [dict(row) for row in rows]

@router.post("/", response_model=Venue, dependencies=[Depends(get_admin_key)])
async def create_venue(venue: VenueCreate, db: asyncpg.Connection = Depends(get_db)):
    row = await db.fetchrow(
        "INSERT INTO venue (name, capacity) VALUES ($1, $2) RETURNING id, name, capacity, is_active",
        venue.name, venue.capacity
    )
    return dict(row)
