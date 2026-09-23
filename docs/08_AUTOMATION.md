# Automation Architecture

## 1. Unit Testing (Backend)
- **Framework:** Pytest
- **Coverage Tool:** `pytest-cov` (Coverage.py)
- **Strategy:** 
  - Test individual core utility functions in isolation.
  - Test complex pure functions (e.g., password hashing, total calculation).
  - Target >80% coverage on the `core/` and `models/` directories.
  - Rely on dependency injection (mocking DB dependencies if necessary for speed, though an in-memory or rolled-back test DB is preferred for realism).

## 2. API Integration Testing
*(To be detailed in Phase 4)*
- **Framework:** Pytest + HTTPX / FastAPI TestClient

## 3. UI E2E Testing
*(To be detailed in Phase 5)*
- **Framework:** Playwright (Python)
- **Pattern:** Page Object Model (POM)

## 4. Test Data Management & Teardown
*(To be expanded)*
- We strictly avoid test pollution. All tests must clean up their database footprints via transactional rollbacks or explicit teardowns.
