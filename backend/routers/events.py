from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import asyncpg

router = APIRouter(prefix="/api/events", tags=["events"])

class EventHeader(BaseModel):
    id: int
    title: str
    description: Optional[str]
    venue_name: str
    department_name: str
    start_time: datetime
    end_time: datetime
    registration_count: int

@router.get("/", response_model=List[EventHeader])
async def get_events(db: asyncpg.Connection = Depends(get_db)):
    query = """
        SELECT 
            e.id, e.title, e.description, v.name as venue_name, 
            d.name as department_name, e.start_time, e.end_time,
            (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as registration_count
        FROM events e
        JOIN venue v ON e.venue_id = v.id
        JOIN departments d ON e.department_id = d.id
        WHERE e.status = 'approved' 
          AND e.is_public = true 
          AND e.start_time > NOW()
        ORDER BY e.start_time ASC
    """
    rows = await db.fetch(query)
    return [dict(row) for row in rows]

@router.get("/{id}", response_model=EventHeader)
async def get_event(id: int, db: asyncpg.Connection = Depends(get_db)):
    query = """
        SELECT 
            e.id, e.title, e.description, v.name as venue_name, 
            d.name as department_name, e.start_time, e.end_time,
            (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as registration_count
        FROM events e
        JOIN venue v ON e.venue_id = v.id
        JOIN departments d ON e.department_id = d.id
        WHERE e.id = $1 
          AND e.status = 'approved' 
          AND e.is_public = true 
          AND e.start_time > NOW()
    """
    row = await db.fetchrow(query, id)
    if not row:
        raise HTTPException(status_code=404, detail="Event not found or not available")
    return dict(row)
