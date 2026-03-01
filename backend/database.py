from typing import Optional
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "eventsphere")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

class Database:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        if not self.pool:
            try:
                self.pool = await asyncpg.create_pool(dsn=DATABASE_URL)
                print("Database connection pool created.")
            except Exception as e:
                print(f"Failed to create database connection pool: {e}")
                raise e

    async def disconnect(self):
        pool = self.pool
        if pool:
            await pool.close()
            print("Database connection pool closed.")
            self.pool = None

    async def get_db_status(self) -> bool:
        if not self.pool:
            return False
        try:
            async with self.pool.acquire() as connection:
                await connection.execute("SELECT 1")
                return True
        except Exception:
            return False
        return False

db = Database()

async def get_db():
    if not db.pool:
        await db.connect()
    
    if db.pool is None:
        raise RuntimeError("Database pool not initialized")
        
    async with db.pool.acquire() as connection:
        yield connection
