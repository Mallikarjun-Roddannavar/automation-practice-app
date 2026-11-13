import os
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from models import AppUser

passwords = CryptContext(schemes=['pbkdf2_sha256'], deprecated='auto')
oauth = OAuth2PasswordBearer(tokenUrl='token')
SECRET = os.getenv('JWT_SECRET_KEY', 'practice-only-change-me')
def create_token(username: str, role: str) -> str:
    return jwt.encode({'sub': username, 'role': role, 'exp': datetime.now(timezone.utc) + timedelta(hours=2)}, SECRET, algorithm='HS256')
def get_current_user(token: str = Depends(oauth)) -> AppUser:
    error = HTTPException(status_code=401, detail='Could not validate credentials', headers={'WWW-Authenticate': 'Bearer'})
    try:
        payload = jwt.decode(token, SECRET, algorithms=['HS256'])
        if not isinstance(payload.get('sub'), str) or payload.get('role') not in ('admin', 'shopper'):
            raise error
        return AppUser(username=payload['sub'], role=payload['role'])
    except JWTError as exc:
        raise error from exc

def require_admin(user: AppUser = Depends(get_current_user)) -> AppUser:
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail='Admin access required')
    return user
