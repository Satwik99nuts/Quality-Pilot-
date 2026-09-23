# Architectural and Technological Decisions

## Decision 1: Python and FastAPI for the Backend
**1. Explain WHAT was chosen:** Python 3.12+ with FastAPI.
**2. Explain WHY it was chosen:** FastAPI provides automatic OpenAPI documentation, high performance (via Starlette/Pydantic), and native async support. Python is the dominant language in AI and test automation.
**3. Explain the PROBLEM it solves:** We need a fast, typed, and easily documentable backend to act as the System Under Test and the test orchestration layer.
**4. Explain what alternatives were considered:** Node.js/Express, Java/Spring Boot, Django.
**5. Explain WHY those alternatives were not selected:** Django is too monolithic for a clean API-first approach. Node.js fragments the language stack (since Pytest/Playwright-Python are used for testing). Spring Boot is too verbose for a portfolio project meant to highlight testing/AI.
**6. Explain the trade-offs:** Python's GIL can limit true multi-threading, but for I/O bound tasks (like testing and web requests), async/await handles this perfectly.
**7. Explain the consequences:** The entire backend and automation stack shares a single language ecosystem.
**8. Explain when this decision should be reconsidered:** If CPU-bound processing (like heavy image processing) becomes a core feature.
**9. Affects:** Improves maintainability (single language).
**10. Concrete example:** Pydantic schemas inherently validate API payloads and generate the Swagger UI, making API testing straightforward.
**11. Likely interview questions:** "Why FastAPI instead of Django or Flask?"
**12. Short interview-ready answer:** "FastAPI offers modern Python async support, automatic OpenAPI generation which is crucial for API testing, and strict type validation with Pydantic, making it an ideal, lightweight candidate for building robust, testable APIs."

## Decision 2: PostgreSQL and SQLAlchemy
**1. Explain WHAT was chosen:** PostgreSQL as the relational database, SQLAlchemy as the ORM.
**2. Explain WHY it was chosen:** PostgreSQL is robust, ACID-compliant, and industry standard. SQLAlchemy is the most mature Python ORM.
**3. Explain the PROBLEM it solves:** E-commerce requires relational data (Users -> Orders -> Products). We need to validate database states deterministically.
**4. Explain what alternatives were considered:** MongoDB (NoSQL), SQLite.
**5. Explain WHY those alternatives were not selected:** MongoDB lacks strong relational integrity which is important for e-commerce. SQLite is not production-representative.
**6. Explain the trade-offs:** SQLAlchemy has a steep learning curve compared to simpler ORMs like Peewee, and managing migrations requires Alembic.
**7. Explain the consequences:** We must explicitly define schemas and relationships.
**8. Explain when this decision should be reconsidered:** If we need to store massive amounts of unstructured data (e.g., raw LLM logs), a NoSQL document store alongside Postgres might be needed.
**9. Affects:** Ensures reliability and data integrity.
**10. Concrete example:** The `CartItem` model has a foreign key to `Product` and `Cart`, ensuring no orphaned items.
**11. Likely interview questions:** "How do you validate the database in your tests?"
**12. Short interview-ready answer:** "I use SQLAlchemy to connect directly to a test PostgreSQL instance. After triggering an API checkout, my test explicitly queries the `orders` and `order_items` tables to ensure the data was physically written and foreign keys match."

## Decision 3: Next.js with App Router and Tailwind CSS
**1. Explain WHAT was chosen:** Next.js (React framework) using the App Router, written in TypeScript, styled with Tailwind CSS.
**2. Explain WHY it was chosen:** Next.js is the industry standard for React applications. Tailwind provides rapid UI development through utility classes. TypeScript ensures type safety across the frontend.
**3. Explain the PROBLEM it solves:** We need a modern, responsive, and maintainable frontend for both the System Under Test (ShopSphere) and the testing dashboard (QualityPilot).
**4. Explain what alternatives were considered:** Vue.js/Nuxt, standard React (Create React App/Vite).
**5. Explain WHY those alternatives were not selected:** React is the most common frontend requirement for SDETs targeting full-stack. Standard Vite React lacks built-in server-side routing, and Next.js offers a more structured, production-ready environment.
**6. Explain the trade-offs:** The App Router introduces a steeper learning curve (Server Components vs Client Components) compared to traditional React.
**7. Explain the consequences:** We must strictly manage where state exists (using `"use client"` directives).
**8. Explain when this decision should be reconsidered:** If the UI becomes overly dynamic and we need an extremely lightweight SPA, standard Vite might be simpler.
**9. Affects:** Enhances maintainability (TypeScript) and styling speed (Tailwind).
**10. Concrete example:** The UI tests (Playwright) will target distinct standard HTML elements generated by React, meaning we must ensure consistent `data-testid` attributes are added to components.
**11. Likely interview questions:** "Why use Next.js instead of a standard React SPA?"
**12. Short interview-ready answer:** "Next.js provides a robust, opinionated structure with built-in routing and optimizations, which ensures the application remains maintainable and performs well as it scales, while TypeScript prevents a large class of runtime errors."

## Decision 4: Pytest for Unit and API Testing
**1. Explain WHAT was chosen:** Pytest and coverage.py for unit testing the backend.
**2. Explain WHY it was chosen:** Pytest is the industry standard for Python testing due to its concise syntax, powerful fixture system, and massive plugin ecosystem.
**3. Explain the PROBLEM it solves:** We need to verify that backend services, utilities, and API endpoints function correctly in isolation before running heavy E2E tests.
**4. Explain what alternatives were considered:** Python's built-in `unittest`.
**5. Explain WHY those alternatives were not selected:** `unittest` requires verbose boilerplate (classes, `self.assertEqual()`), whereas Pytest uses simple `assert` statements and a highly reusable fixture system based on dependency injection.
**6. Explain the trade-offs:** Pytest fixtures can sometimes obscure where data is coming from (magic parameters), requiring discipline in fixture scoping and naming.
**7. Explain the consequences:** All tests will rely heavily on `conftest.py` for setup/teardown logic.
**8. Explain when this decision should be reconsidered:** Pytest is universally applicable in Python; there is rarely a reason to reconsider unless switching languages entirely.
**9. Affects:** Greatly improves maintainability, readability, and test execution speed.
**10. Concrete example:** We will use a `@pytest.fixture` to yield a test database session, automatically rolling back the transaction after each test so no test pollutes the database for another.
**11. Likely interview questions:** "Why do you prefer Pytest over `unittest`?"
**12. Short interview-ready answer:** "Pytest eliminates class-based boilerplate, allows plain assert statements with detailed introspection on failure, and offers an incredible fixture system that uses dependency injection for highly reusable setup and teardown code."

## Decision 5: In-Memory SQLite for API Testing
**1. Explain WHAT was chosen:** SQLite in-memory database (`sqlite:///:memory:`) combined with FastAPI dependency overrides for API testing.
**2. Explain WHY it was chosen:** It allows tests to run completely isolated, deterministically, and blazingly fast without requiring a separate PostgreSQL instance for CI/CD or local test runs.
**3. Explain the PROBLEM it solves:** Running tests against a real Postgres database introduces latency, requires managing test database state (truncating tables), and adds DevOps overhead for CI pipelines.
**4. Explain what alternatives were considered:** Testcontainers (spinning up Docker Postgres), Mocking SQLAlchemy entirely.
**5. Explain WHY those alternatives were not selected:** Testcontainers is too slow for fast unit/API tests (great for E2E though). Mocking SQLAlchemy completely hides real SQL syntax errors and defeats the purpose of integration testing endpoints.
**6. Explain the trade-offs:** SQLite does not support all PostgreSQL features (like specific array types or JSONB). Tests might pass in SQLite but fail in Postgres if specialized syntax is used.
**7. Explain the consequences:** We must stick to standard ANSI SQL or SQLAlchemy ORM abstractions that work across both, or conditionally skip tests.
**8. Explain when this decision should be reconsidered:** If the application heavily utilizes Postgres-specific extensions (PostGIS, pgvector), we must switch to Testcontainers.
**9. Affects:** Greatly improves test speed, maintainability, and developer experience.
**10. Concrete example:** In `conftest.py`, `app.dependency_overrides[get_db] = override_get_db` replaces the Postgres session with an SQLite in-memory session dynamically.
**11. Likely interview questions:** "Why did you use SQLite for testing when your production DB is Postgres?"
**12. Short interview-ready answer:** "SQLite in-memory provides blazing fast, isolated test execution without DevOps overhead. While it sacrifices perfect database parity, I mitigate this by using standard SQLAlchemy ORM abstractions, saving Testcontainers for heavier E2E tests."
 
 