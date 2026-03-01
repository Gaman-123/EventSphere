from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import get_db, db
from middleware.auth import get_admin_key
import asyncpg
from starlette.status import HTTP_409_CONFLICT, HTTP_404_NOT_FOUND

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_admin_key)])

class EventCreate(BaseModel):
    title: str
    description: Optional[str]
    venue_id: int
    department_id: int
    start_time: datetime
    end_time: datetime
    created_by: int

class EventUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    venue_id: Optional[int]
    department_id: Optional[int]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    is_public: Optional[bool]

class RegistrationInfo(BaseModel):
    id: int
    student_name: str
    student_email: str
    roll_number: str
    registered_at: datetime

@router.post("/events")
async def create_event(event: EventCreate, conn: asyncpg.Connection = Depends(get_db)):
    try:
        row = await conn.fetchrow(
            """
            INSERT INTO events (title, description, venue_id, department_id, start_time, end_time, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            """,
            event.title, event.description, event.venue_id, event.department_id, 
            event.start_time, event.end_time, event.created_by
        )
        return {"id": row["id"], "message": "Event created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/events/{id}")
async def update_event(id: int, event: EventUpdate, conn: asyncpg.Connection = Depends(get_db)):
    # Build update query dynamically
    fields = []
    values = []
    for field, value in event.dict(exclude_unset=True).items():
        fields.append(f"{field} = ${len(values) + 1}")
        values.append(value)
    
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    values.append(id)
    query = f"UPDATE events SET {', '.join(fields)} WHERE id = ${len(values)} RETURNING id"
    
    try:
        row = await conn.fetchrow(query, *values)
        if not row:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"message": "Event updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class ApprovalRequest(BaseModel):
    admin_id: int

@router.put("/events/{id}/approve")
async def approve_event(id: int, approval: ApprovalRequest, conn: asyncpg.Connection = Depends(get_db)):
    try:
        row = await conn.fetchrow(
            "UPDATE events SET status = 'approved', approved_by = $1 WHERE id = $2 RETURNING id",
            approval.admin_id, id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"message": "Event approved"}
    except asyncpg.RaiseError as e:
        if 'Venue is already booked' in str(e):
            raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Venue is already booked for this time slot.")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/events/{id}/publish")
async def publish_event(id: int, conn: asyncpg.Connection = Depends(get_db)):
    row = await conn.fetchrow("UPDATE events SET is_public = true WHERE id = $1 RETURNING id", id)
    if not row:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event published"}

@router.get("/events/{id}/registrations", response_model=List[RegistrationInfo])
async def get_event_registrations(id: int, conn: asyncpg.Connection = Depends(get_db)):
    rows = await conn.fetch("SELECT * FROM registrations WHERE event_id = $1", id)
    return [dict(row) for row in rows]

@router.get("/events")
async def get_all_events(conn: asyncpg.Connection = Depends(get_db)):
    query = """
        SELECT e.id, e.title, e.description, v.name as venue_name, e.venue_id,
            d.name as department_name, e.department_id, e.start_time, e.end_time,
            e.status, e.is_public,
            (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as registration_count
        FROM events e
        JOIN venue v ON e.venue_id = v.id
        JOIN departments d ON e.department_id = d.id
        ORDER BY e.start_time DESC
    """
    rows = await conn.fetch(query)
    return [dict(row) for row in rows]

@router.get("/stats")
async def get_dashboard_stats(conn: asyncpg.Connection = Depends(get_db)):
    total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
    pending_approvals = await conn.fetchval("SELECT COUNT(*) FROM events WHERE status = 'pending'")
    total_registrations = await conn.fetchval("SELECT COUNT(*) FROM registrations")
    active_venues = await conn.fetchval("SELECT COUNT(*) FROM venue WHERE status = 'active'")
    
    # Chart data (engagements top 5 events)
    chart_rows = await conn.fetch("""
        SELECT e.title as name, COUNT(r.id) as registrations
        FROM events e
        LEFT JOIN registrations r ON r.event_id = e.id
        GROUP BY e.id, e.title
        ORDER BY registrations DESC
        LIMIT 5
    """)
    chart_data = [{"name": row["name"][:10] + "...", "registrations": row["registrations"]} for row in chart_rows]

    # Status breakdown
    status_rows = await conn.fetch("""
        SELECT status, COUNT(*) as count 
        FROM events 
        GROUP BY status
    """)
    status_counts = {row["status"]: row["count"] for row in status_rows}
    status_data = [
        {"name": "Approved", "value": status_counts.get("approved", 0), "color": "#10b981"},
        {"name": "Pending", "value": status_counts.get("pending", 0), "color": "#f59e0b"},
        {"name": "Rejected", "value": status_counts.get("rejected", 0), "color": "#ef4444"}
    ]

    return {
        "totalEvents": total_events,
        "pendingApprovals": pending_approvals,
        "totalRegistrations": total_registrations,
        "activeVenues": active_venues,
        "chartData": chart_data,
        "statusData": status_data
    }

@router.get("/health")
async def health_check():
    db_status = await db.get_db_status()
    return {
        "status": "ok",
        "database": "connected" if db_status else "disconnected"
    }
