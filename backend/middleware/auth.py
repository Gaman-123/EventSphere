import os
from fastapi import Request, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from starlette.status import HTTP_401_UNAUTHORIZED
from dotenv import load_dotenv

load_dotenv()

ADMIN_API_KEY = os.getenv("ADMIN_API_KEY")
API_KEY_NAME = "x-admin-key"

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_admin_key(header_value: str = Security(api_key_header)):
    if header_value == ADMIN_API_KEY:
        return header_value
    raise HTTPException(
        status_code=HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing admin key",
    )
