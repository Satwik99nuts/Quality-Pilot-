# E2E Test Configuration for Playwright + Pytest
#
# These tests require both the backend (FastAPI) and frontend (Next.js) to be running:
#   Backend:  cd backend && uvicorn app.main:app --port 8000
#   Frontend: cd frontend && npm run dev
#
# Run E2E tests:
#   cd backend && pytest tests/e2e -v --base-url http://localhost:3000

import pytest
from playwright.sync_api import Page


# ──────────────────────────────────────────────────────────────────────────────
# Unique user generator (to avoid collisions across test runs)
# ──────────────────────────────────────────────────────────────────────────────

_user_counter = 0


def _unique_email() -> str:
    """Generate a unique email for each test invocation."""
    global _user_counter
    _user_counter += 1
    import time
    return f"e2e_user_{int(time.time())}_{_user_counter}@test.com"


# ──────────────────────────────────────────────────────────────────────────────
# Fixtures
# ──────────────────────────────────────────────────────────────────────────────

@pytest.fixture(scope="session")
def base_url():
    """Base URL of the running Next.js frontend."""
    return "http://localhost:3000"


@pytest.fixture(scope="session")
def api_url():
    """Base URL of the running FastAPI backend."""
    return "http://localhost:8000/api/v1"


@pytest.fixture
def unique_user():
    """Return a dict with unique user credentials for registration tests."""
    email = _unique_email()
    return {
        "email": email,
        "password": "SecureP@ss123",
        "full_name": "E2E Test User",
    }


@pytest.fixture
def registered_user(page: Page, base_url: str, unique_user: dict):
    """Register a fresh user via the UI and return the credentials.
    
    After this fixture, the user is NOT logged in (redirected to login page).
    """
    page.goto(f"{base_url}/register")
    page.get_by_test_id("register-name").fill(unique_user["full_name"])
    page.get_by_test_id("register-email").fill(unique_user["email"])
    page.get_by_test_id("register-password").fill(unique_user["password"])
    page.get_by_test_id("register-submit").click()

    # Wait for redirect to login page
    page.wait_for_url("**/login**", timeout=10000)

    return unique_user


@pytest.fixture
def authenticated_page(page: Page, base_url: str, registered_user: dict):
    """Register, then log in, returning a page in an authenticated state."""
    page.goto(f"{base_url}/login")
    page.get_by_test_id("login-email").fill(registered_user["email"])
    page.get_by_test_id("login-password").fill(registered_user["password"])
    page.get_by_test_id("login-submit").click()

    # Wait for redirect to home page after login
    page.wait_for_url(f"{base_url}/", timeout=10000)
    # Verify the greeting appears
    page.get_by_test_id("nav-user-greeting").wait_for(state="visible", timeout=5000)

    return page
