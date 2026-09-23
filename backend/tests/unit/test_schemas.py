import pytest
from pydantic import ValidationError
from app.schemas.user import UserCreate
from app.schemas.product import ProductCreate

def test_user_create_valid():
    user = UserCreate(email="test@example.com", password="password123", full_name="Test User")
    assert user.email == "test@example.com"
    assert user.full_name == "Test User"
    assert user.password == "password123"

def test_user_create_invalid_email():
    with pytest.raises(ValidationError) as exc_info:
        UserCreate(email="invalid-email", password="password123")
    
    assert "value is not a valid email address" in str(exc_info.value)

def test_product_create_valid():
    product = ProductCreate(
        name="Test Product",
        price=99.99,
        stock_quantity=10,
        description="A great product"
    )
    assert product.name == "Test Product"
    assert product.price == 99.99
    assert product.stock_quantity == 10

def test_product_create_invalid_type():
    with pytest.raises(ValidationError):
        ProductCreate(
            name="Test Product",
            price="not-a-number",  # Invalid type
            stock_quantity=10
        )
