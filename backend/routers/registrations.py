from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from database import get_db
import asyncpg
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT

router = APIRouter(prefix="/api/events", tags=["registrations"])

class RegistrationCreate(BaseModel):
    student_name: str
    student_email: EmailStr
    roll_number: str

@router.post("/{id}/register")
async def register_for_event(id: int, registration: RegistrationCreate, db: asyncpg.Connection = Depends(get_db)):
    # First check if event exists and is public/approved/future
    event_check = await db.fetchrow(
        "SELECT id FROM events WHERE id = $1 AND status = 'approved' AND is_public = true AND start_time > NOW()",
        id
    )
    if not event_check:
        raise HTTPException(status_code=404, detail="Event not found or closed for registration")

    try:
        await db.execute(
            """
            INSERT INTO registrations (event_id, student_name, student_email, roll_number)
            VALUES ($1, $2, $3, $4)
            """,
            id, registration.student_name, registration.student_email, registration.roll_number
        )
        return {"message": "Successfully registered"}
    except asyncpg.RaiseError as e:
        # Handle the custom trigger exception for capacity
        if 'Event is full. Venue capacity reached.' in str(e):
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Event is full")
        raise HTTPException(status_code=500, detail=str(e))
    except asyncpg.UniqueViolationError:
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Already registered for this event")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
