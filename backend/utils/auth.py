import hashlib
import secrets

def get_password_hash(password: str) -> str:
    # We use a simple salt+sha256 as a fallback since bcrypt seems to have issues in this env
    salt = secrets.token_hex(8)
    h = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${h}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt, h = hashed_password.split("$")
        return hashlib.sha256((plain_password + salt).encode()).hexdigest() == h
    except:
        return False
