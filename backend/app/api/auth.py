from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.api.deps import SessionDep
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.models.cart import Cart
from app.schemas.user import UserCreate, User as UserSchema
from app.schemas.token import Token

router = APIRouter()

@router.post("/register", response_model=UserSchema)
def register_user(session: SessionDep, user_in: UserCreate) -> Any:
    user = session.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Create empty cart for the new user
    cart = Cart(user_id=user.id)
    session.add(cart)
    session.commit()
    
    return user

@router.post("/login", response_model=Token)
def login_access_token(session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = session.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return {
        "access_token": create_access_token({"email": user.email}),
        "token_type": "bearer",
    }

@router.post("/logout")
def logout() -> Any:
    # JWT is stateless, so we just return success. Client should discard the token.
    return {"message": "Successfully logged out"}
