from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import db
from routers import events, registrations, admin, venues, departments, auth
import asyncpg

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to the database
    await db.connect()
    yield
    # Shutdown: Close database connection pool
    await db.disconnect()

app = FastAPI(title="EventSphere API", lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events.router)
app.include_router(registrations.router)
app.include_router(admin.router)
app.include_router(venues.router)
app.include_router(departments.router)
app.include_router(auth.router)

@app.exception_handler(asyncpg.PostgresError)
async def postgres_exception_handler(request: Request, exc: asyncpg.PostgresError):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Database error: {str(exc)}"},
    )

@app.get("/")
async def root():
    return {"message": "Welcome to EventSphere API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
