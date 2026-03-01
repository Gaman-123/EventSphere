from database import get_db, db
from utils.auth import get_password_hash
import asyncpg
import os
import asyncio
from dotenv import load_dotenv

async def seed_admin():
    load_dotenv()
    user = os.getenv('DB_USER', 'postgres')
    password = os.getenv('DB_PASSWORD', 'postgres')
    host = os.getenv('DB_HOST', 'localhost')
    port = os.getenv('DB_PORT', '5432')
    database = os.getenv('DB_NAME', 'eventsphere')
    db_url = f'postgresql://{user}:{password}@{host}:{port}/{database}'
    
    conn = await asyncpg.connect(db_url)
    
    # Create Superadmin
    print("Seeding Superadmin...")
    hashed_pw = get_password_hash("admin123")
    await conn.execute("""
        INSERT INTO admins (email, password_hash, is_superadmin)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO UPDATE SET password_hash = $2
    """, 'admin@eventsphere.com', hashed_pw, True)
    
    # Create CSE Dept Admin
    print("Seeding Dept Admin (CSE)...")
    cse_hashed_pw = get_password_hash("cseadmin")
    await conn.execute("""
        INSERT INTO admins (email, password_hash, is_superadmin, department_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE SET password_hash = $2
    """, 'cse@eventsphere.com', cse_hashed_pw, False, 1)
    
    print("Seeding completed.")
        
    await conn.close()

if __name__ == "__main__":
    asyncio.run(seed_admin())
