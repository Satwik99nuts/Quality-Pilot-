"""
E2E Tests – Product Browsing, Cart, and Checkout Flows

These tests exercise the full purchase flow in a real Chromium browser.
Prerequisites:
  - FastAPI backend running on http://localhost:8000 (with seeded products)
  - Next.js frontend running on http://localhost:3000
  - PostgreSQL database running with seeded data
"""
from playwright.sync_api import Page, expect


# ──────────────────────────────────────────────────────────────────────────────
# Product Browsing
# ──────────────────────────────────────────────────────────────────────────────

def test_home_page_loads_products(page: Page, base_url: str):
    """Home page should display the product list."""
    page.goto(f"{base_url}/")

    expect(page.get_by_test_id("page-title")).to_have_text("Featured Products")

    # Wait for the product list to render (API fetch completes)
    product_list = page.get_by_test_id("product-list")
    expect(product_list).to_be_visible(timeout=10000)


def test_product_detail_page(page: Page, base_url: str):
    """Clicking 'View Details' on a product card navigates to the detail page."""
    page.goto(f"{base_url}/")

    # Wait for products to load
    page.get_by_test_id("product-list").wait_for(state="visible", timeout=10000)

    # Click the first product's "View Details" link
    first_view_link = page.locator("[data-testid^='view-product-']").first
    first_view_link.click()

    # Should navigate to /product/<id>
    page.wait_for_url("**/product/**", timeout=10000)

    # Product detail elements should be visible
    expect(page.get_by_test_id("product-title")).to_be_visible()
    expect(page.get_by_test_id("product-price")).to_be_visible()
    expect(page.get_by_test_id("product-description")).to_be_visible()
    expect(page.get_by_test_id("add-to-cart-btn")).to_be_visible()


# ──────────────────────────────────────────────────────────────────────────────
# Add to Cart (requires authentication)
# ──────────────────────────────────────────────────────────────────────────────

def test_add_to_cart_redirects_guest_to_login(page: Page, base_url: str):
    """Unauthenticated user clicking 'Add to Cart' should be redirected to login."""
    page.goto(f"{base_url}/")

    # Wait for products
    page.get_by_test_id("product-list").wait_for(state="visible", timeout=10000)

    # Navigate to first product detail
    first_view_link = page.locator("[data-testid^='view-product-']").first
    first_view_link.click()
    page.wait_for_url("**/product/**", timeout=10000)

    # Click "Add to Cart" as a guest
    page.get_by_test_id("add-to-cart-btn").click()

    # Should redirect to login
    page.wait_for_url("**/login**", timeout=10000)


def test_add_to_cart_success(authenticated_page: Page, base_url: str):
    """Authenticated user adds a product to cart and is redirected to cart page."""
    page = authenticated_page

    page.goto(f"{base_url}/")

    # Wait for products to load
    page.get_by_test_id("product-list").wait_for(state="visible", timeout=10000)

    # Navigate to first product detail
    first_view_link = page.locator("[data-testid^='view-product-']").first
    first_view_link.click()
    page.wait_for_url("**/product/**", timeout=10000)

    # Click "Add to Cart"
    page.get_by_test_id("add-to-cart-btn").click()

    # Should redirect to cart page
    page.wait_for_url("**/cart**", timeout=10000)

    # Cart should have items
    cart_items = page.get_by_test_id("cart-items")
    expect(cart_items).to_be_visible(timeout=5000)


# ──────────────────────────────────────────────────────────────────────────────
# Cart Page
# ──────────────────────────────────────────────────────────────────────────────

def test_cart_shows_total(authenticated_page: Page, base_url: str):
    """After adding an item, the cart page should display a total > $0."""
    page = authenticated_page

    # Navigate to product detail and add to cart
    page.goto(f"{base_url}/")
    page.get_by_test_id("product-list").wait_for(state="visible", timeout=10000)
    first_view_link = page.locator("[data-testid^='view-product-']").first
    first_view_link.click()
    page.wait_for_url("**/product/**", timeout=10000)
    page.get_by_test_id("add-to-cart-btn").click()
    page.wait_for_url("**/cart**", timeout=10000)

    # Verify total is visible and non-zero
    cart_total = page.get_by_test_id("cart-total")
    expect(cart_total).to_be_visible()
    total_text = cart_total.inner_text()
    # Total should be a dollar amount like "$699.99"
    assert total_text.startswith("$"), f"Expected total to start with '$', got: {total_text}"
    amount = float(total_text.replace("$", "").replace(",", ""))
    assert amount > 0, f"Cart total should be > 0, got {amount}"


def test_checkout_link_visible_in_cart(authenticated_page: Page, base_url: str):
    """The 'Proceed to Checkout' link should be visible when cart has items."""
    page = authenticated_page

    # Add item to cart
    page.goto(f"{base_url}/")
    page.get_by_test_id("product-list").wait_for(state="visible", timeout=10000)
    page.locator("[data-testid^='view-product-']").first.click()
    page.wait_for_url("**/product/**", timeout=10000)
    page.get_by_test_id("add-to-cart-btn").click()
    page.wait_for_url("**/cart**", timeout=10000)

    # Checkout link should be visible
    expect(page.get_by_test_id("checkout-link")).to_be_visible()


# ──────────────────────────────────────────────────────────────────────────────
# Full Checkout Flow
# ──────────────────────────────────────────────────────────────────────────────

def test_full_checkout_flow(authenticated_page: Page, base_url: str):
    """Complete purchase: browse → add to cart → checkout → confirmation."""
    page = authenticated_page

    # 1. Browse and add product to cart
    page.goto(f"{base_url}/")
    page.get_by_test_id("product-list").wait_for(state="visible", timeout=10000)
    page.locator("[data-testid^='view-product-']").first.click()
    page.wait_for_url("**/product/**", timeout=10000)
    page.get_by_test_id("add-to-cart-btn").click()
    page.wait_for_url("**/cart**", timeout=10000)

    # 2. Proceed to checkout
    page.get_by_test_id("checkout-link").click()
    page.wait_for_url("**/checkout**", timeout=10000)

    # 3. Verify checkout page loaded
    expect(page.get_by_test_id("page-title")).to_have_text("Checkout")
    expect(page.get_by_test_id("checkout-form")).to_be_visible()
    expect(page.get_by_test_id("checkout-total")).to_be_visible()

    # 4. Fill mock payment form
    page.get_by_test_id("checkout-card").fill("4242 4242 4242 4242")
    page.locator("input[placeholder='MM/YY']").fill("12/28")
    page.locator("input[placeholder='123']").fill("456")

    # 5. Submit order
    page.get_by_test_id("checkout-submit").click()

    # 6. Verify success page
    success_heading = page.get_by_test_id("checkout-success")
    expect(success_heading).to_be_visible(timeout=15000)
    expect(success_heading).to_have_text("Order Confirmed!")

    # 7. "Continue Shopping" button should be visible
    expect(page.get_by_test_id("continue-shopping-btn")).to_be_visible()
