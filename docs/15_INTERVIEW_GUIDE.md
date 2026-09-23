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
