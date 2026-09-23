# SDET Interview Guide

This document tracks likely interview questions based on the implementation of QualityPilot.

## General Architecture
**Q:** Why did you choose to build a custom testing platform instead of just using Jenkins/Allure?
**A:** I wanted to demonstrate full-stack engineering ability alongside SDET skills. Building the platform allows me to tightly integrate an LLM for test generation and failure analysis in a way that off-the-shelf tools don't currently support, while still using standard tools like Pytest and Playwright for the actual execution.

## Phase 1: Backend & Database
**Q:** Why FastAPI instead of Django?
**A:** FastAPI offers modern Python async support, automatic OpenAPI generation which is crucial for API testing, and strict type validation with Pydantic, making it an ideal, lightweight candidate for building robust, testable APIs.

**Q:** How do you validate the database in your tests?
**A:** I use SQLAlchemy to connect directly to a test PostgreSQL instance. After triggering an API checkout, my test explicitly queries the `orders` and `order_items` tables to ensure the data was physically written and foreign keys match.

**Q:** Why use JWT for authentication in this project?
**A:** JWT allows for stateless authentication, which is easier to scale and simplifies the API testing setup since tests just need to request a token and pass it in the Authorization header, without needing to maintain session cookies on the backend.

## Phase 2: Frontend & UI
**Q:** Why use Next.js instead of a standard React SPA?
**A:** Next.js provides a robust, opinionated structure with built-in routing and optimizations, which ensures the application remains maintainable and performs well as it scales, while TypeScript prevents a large class of runtime errors.

**Q:** How does Tailwind CSS affect your UI automation strategy?
**A:** Because Tailwind relies heavily on utility classes, the CSS class names can become very long and sometimes change during refactoring. Therefore, my UI automation strategy explicitly avoids selecting elements by CSS class, and instead relies on `data-testid` attributes or semantic ARIA roles.

## Phase 3: Unit Testing & Pytest
**Q:** Why do you prefer Pytest over `unittest`?
**A:** Pytest eliminates class-based boilerplate, allows plain assert statements with detailed introspection on failure, and offers an incredible fixture system that uses dependency injection for highly reusable setup and teardown code.

**Q:** How do you handle database states between unit tests?
**A:** I use Pytest fixtures scoped to the function level. The fixture creates a database session, yields it to the test, and then explicitly rolls back the transaction or truncates tables in the teardown phase. This ensures strict isolation and prevents test pollution.

**Q:** Why did you use SQLite for testing when your production DB is Postgres?
**A:** SQLite in-memory provides blazing fast, isolated test execution without DevOps overhead. While it sacrifices perfect database parity, I mitigate this by using standard SQLAlchemy ORM abstractions, saving Testcontainers or a real Postgres instance for heavier E2E tests.

## Phase 5: E2E UI Testing (Playwright)
**Q:** Why Playwright instead of Selenium?
**A:** Playwright offers built-in auto-waiting (no need for explicit `WebDriverWait`), multi-browser support out of the box, and a modern async API. It's faster, less flaky, and doesn't require managing separate WebDriver binaries. Using `pytest-playwright` keeps everything in our Python/Pytest ecosystem.

**Q:** Why not use Cypress for E2E testing?
**A:** Cypress only runs in Chromium-family browsers and has its own test runner (Mocha), which would split our test infrastructure between Python and JavaScript. Playwright supports Chrome, Firefox, and WebKit, and `pytest-playwright` lets us write E2E tests alongside our API and unit tests in the same framework.

**Q:** How do you handle element selection in UI tests?
**A:** I use `data-testid` attributes exclusively for E2E tests. They're immune to CSS class changes, text updates, and DOM restructuring. Playwright's `get_by_test_id()` makes them first-class citizens, keeping locators stable across visual refactors.

**Q:** How do you handle E2E test flakiness?
**A:** Three strategies: (1) Playwright's auto-waiting handles most timing issues automatically. (2) I use explicit `wait_for_url()` and `wait_for(state="visible")` for navigation and async data fetching. (3) Each test registers a fresh user with a unique email, ensuring complete data isolation between test runs.

**Q:** How do you structure your test pyramid?
**A:** Unit tests (Pytest) form the base — they're fast, isolated, and run on every commit. API integration tests (TestClient + SQLite) form the middle layer — they verify endpoint behavior without a browser. E2E tests (Playwright) are at the top — they're slower but validate the full user flow through a real browser. If a bug can be caught at the API layer, I write the test there instead of a slow E2E test.
