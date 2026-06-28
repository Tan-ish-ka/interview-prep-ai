from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from interview_prep_ai.database import get_db
from interview_prep_ai.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from interview_prep_ai.core.models.user import User
from interview_prep_ai.repositories.user_repository import UserRepository
from interview_prep_ai.app.auth_deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str | None = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: str | None
    avatar: str | None
    role: str
    plan: str
    reports_generated: int
    ai_requests: int
    tokens_consumed: int

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    if await repo.get_by_email(user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if await repo.get_by_username(user_in.username):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user = User(
        email=user_in.email,
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
        full_name=user_in.full_name
    )
    await repo.create(user)
    
    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id)
    }

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    repo = UserRepository(db)
    user = await repo.get_by_username(form_data.username)
    if not user:
        user = await repo.get_by_email(form_data.username)
        
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id)
    }

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/refresh", response_model=Token)
async def refresh_token(req: RefreshRequest):
    try:
        payload = decode_token(req.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = payload.get("sub")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    return {
        "access_token": create_access_token(user_id),
        "refresh_token": create_refresh_token(user_id)
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
