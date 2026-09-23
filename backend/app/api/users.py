from typing import Any
from fastapi import APIRouter
from app.api.deps import SessionDep, CurrentUser
from app.schemas.user import User as UserSchema, UserUpdate

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=UserSchema)
def update_user_me(session: SessionDep, current_user: CurrentUser, user_in: UserUpdate) -> Any:
    """
    Update own user.
    """
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.email is not None:
        current_user.email = user_in.email
    if user_in.password is not None:
        from app.core.security import get_password_hash
        current_user.hashed_password = get_password_hash(user_in.password)
        
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user
