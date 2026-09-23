"""
E2E Tests – Authentication Flows (Register, Login, Logout)

These tests exercise the ShopSphere UI in a real Chromium browser.
Prerequisites:
  - FastAPI backend running on http://localhost:8000
  - Next.js frontend running on http://localhost:3000
  - PostgreSQL database running with seeded data
"""
import re
from playwright.sync_api import Page, expect


# ──────────────────────────────────────────────────────────────────────────────
# Registration
# ──────────────────────────────────────────────────────────────────────────────

def test_register_page_loads(page: Page, base_url: str):
    """Verify the registration page renders correctly."""
    page.goto(f"{base_url}/register")

    expect(page.get_by_role("heading", name="Create an Account")).to_be_visible()
    expect(page.get_by_test_id("register-form")).to_be_visible()
    expect(page.get_by_test_id("register-name")).to_be_visible()
    expect(page.get_by_test_id("register-email")).to_be_visible()
    expect(page.get_by_test_id("register-password")).to_be_visible()
    expect(page.get_by_test_id("register-submit")).to_be_visible()


def test_register_success(page: Page, base_url: str, unique_user: dict):
    """Successful registration redirects to the login page."""
    page.goto(f"{base_url}/register")

    page.get_by_test_id("register-name").fill(unique_user["full_name"])
    page.get_by_test_id("register-email").fill(unique_user["email"])
    page.get_by_test_id("register-password").fill(unique_user["password"])
    page.get_by_test_id("register-submit").click()

    # Should redirect to /login after successful registration
    page.wait_for_url("**/login**", timeout=10000)
    expect(page).to_have_url(re.compile(r"/login"))


def test_register_duplicate_email(page: Page, base_url: str, registered_user: dict):
    """Attempting to register with an existing email shows an error."""
    page.goto(f"{base_url}/register")

    page.get_by_test_id("register-name").fill(registered_user["full_name"])
    page.get_by_test_id("register-email").fill(registered_user["email"])
    page.get_by_test_id("register-password").fill(registered_user["password"])
    page.get_by_test_id("register-submit").click()

    # The error message should appear
    error_el = page.get_by_test_id("register-error")
    expect(error_el).to_be_visible(timeout=10000)


# ──────────────────────────────────────────────────────────────────────────────
# Login
# ──────────────────────────────────────────────────────────────────────────────

def test_login_page_loads(page: Page, base_url: str):
    """Verify the login page renders correctly."""
    page.goto(f"{base_url}/login")

    expect(page.get_by_role("heading", name="Login to ShopSphere")).to_be_visible()
    expect(page.get_by_test_id("login-form")).to_be_visible()
    expect(page.get_by_test_id("login-email")).to_be_visible()
    expect(page.get_by_test_id("login-password")).to_be_visible()
    expect(page.get_by_test_id("login-submit")).to_be_visible()


def test_login_success(page: Page, base_url: str, registered_user: dict):
    """Successful login redirects to home and shows user greeting."""
    page.goto(f"{base_url}/login")

    page.get_by_test_id("login-email").fill(registered_user["email"])
    page.get_by_test_id("login-password").fill(registered_user["password"])
    page.get_by_test_id("login-submit").click()

    # Wait for redirect to home page
    page.wait_for_url(f"{base_url}/", timeout=10000)

    # Navbar should now show greeting and logout button
    expect(page.get_by_test_id("nav-user-greeting")).to_be_visible(timeout=5000)
    expect(page.get_by_test_id("nav-logout-btn")).to_be_visible()

    # Login/Register links should be gone
    expect(page.get_by_test_id("nav-login-link")).not_to_be_visible()
    expect(page.get_by_test_id("nav-register-link")).not_to_be_visible()


def test_login_wrong_password(page: Page, base_url: str, registered_user: dict):
    """Login with a wrong password shows an error message."""
    page.goto(f"{base_url}/login")

    page.get_by_test_id("login-email").fill(registered_user["email"])
    page.get_by_test_id("login-password").fill("WrongPassword999!")
    page.get_by_test_id("login-submit").click()

    error_el = page.get_by_test_id("login-error")
    expect(error_el).to_be_visible(timeout=10000)


# ──────────────────────────────────────────────────────────────────────────────
# Logout
# ──────────────────────────────────────────────────────────────────────────────

def test_logout_flow(authenticated_page: Page, base_url: str):
    """Clicking Logout returns the user to the unauthenticated state."""
    page = authenticated_page

    # Verify we start authenticated
    expect(page.get_by_test_id("nav-user-greeting")).to_be_visible()

    # Click logout
    page.get_by_test_id("nav-logout-btn").click()

    # After logout, login/register links should reappear
    expect(page.get_by_test_id("nav-login-link")).to_be_visible(timeout=5000)
    expect(page.get_by_test_id("nav-register-link")).to_be_visible()

    # Greeting and logout button should be gone
    expect(page.get_by_test_id("nav-user-greeting")).not_to_be_visible()
    expect(page.get_by_test_id("nav-logout-btn")).not_to_be_visible()


# ──────────────────────────────────────────────────────────────────────────────
# Navigation Guards
# ──────────────────────────────────────────────────────────────────────────────

def test_navbar_shows_login_register_for_guest(page: Page, base_url: str):
    """Unauthenticated users see Login and Register links in the navbar."""
    page.goto(f"{base_url}/")

    expect(page.get_by_test_id("nav-login-link")).to_be_visible()
    expect(page.get_by_test_id("nav-register-link")).to_be_visible()
    expect(page.get_by_test_id("nav-logout-btn")).not_to_be_visible()
