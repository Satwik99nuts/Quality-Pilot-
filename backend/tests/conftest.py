import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

os.environ["TESTING"] = "True"

from app.main import app
from app.core.database import Base, get_db
from app.core.security import get_password_hash, create_access_token
from app.models.user import User
from app.models.product import Product, Category

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Seed standard test data
    try:
        # Seed categories
        cat1 = Category(name="Electronics", description="Gadgets")
        cat2 = Category(name="Clothing", description="Apparel")
        db.add_all([cat1, cat2])
        db.flush()
        
        # Seed products
        prod1 = Product(name="Smartphone", description="A cool phone", price=699.99, stock_quantity=10, category_id=cat1.id)
        prod2 = Product(name="T-Shirt", description="Cotton t-shirt", price=19.99, stock_quantity=50, category_id=cat2.id)
        db.add_all([prod1, prod2])
        db.commit()
        
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Create a TestClient that uses our test database."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(db_session):
    """Create a standard test user."""
    user = User(
        email="testuser@example.com",
        hashed_password=get_password_hash("testpassword123"),
        full_name="Test User",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # The register endpoint usually creates the cart, so let's mimic that
    from app.models.cart import Cart
    cart = Cart(user_id=user.id)
    db_session.add(cart)
    db_session.commit()
    
    return user

@pytest.fixture(scope="function")
def token(test_user):
    """Generate an access token for the test user."""
    return create_access_token({"email": test_user.email})

@pytest.fixture(scope="function")
def authorized_client(client, token):
    """Return a TestClient with an Authorization header already set."""
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    return client
