# Continuous Integration & Delivery

## CI/CD Architecture (Phase 6)

QualityPilot utilizes **GitHub Actions** for Continuous Integration. The pipeline is designed to execute our complete Testing Pyramid (Unit, API, and E2E tests) on every push and pull request to the `main` branch.

### Workflow Configuration (`.github/workflows/ci.yml`)

The pipeline consists of two distinct jobs that run sequentially:

#### 1. Unit & API Tests (`test-api-unit`)
- **Environment:** Ubuntu (latest), Python 3.12
- **Purpose:** Fast feedback loop for core logic and API endpoints.
- **Database:** Uses Pytest fixtures to dynamically inject an in-memory SQLite database, avoiding the need for a real PostgreSQL instance.
- **Execution:** Runs `pytest` from the backend directory. E2E tests are automatically ignored via `pytest.ini`.

#### 2. End-to-End UI Tests (`test-e2e`)
- **Environment:** Ubuntu (latest), Python 3.12, Node.js 20
- **Dependency:** Only runs if `test-api-unit` passes to conserve CI minutes.
- **Database:** Spins up a real `postgres:15` service container using GitHub Actions `services`.
- **Setup:** 
  1. Runs Alembic migrations (`alembic upgrade head`) and seeds test data (`python app/db/seed.py`).
  2. Installs Playwright Chromium binaries (`playwright install --with-deps chromium`).
  3. Starts the FastAPI backend and Next.js frontend in background processes.
  4. Waits for both services to be responsive using `wait-on`.
- **Execution:** Runs `pytest tests/e2e -v`.
- **Artifacts:** If an E2E test fails, the Playwright trace files are uploaded as a GitHub Actions artifact, allowing engineers to download and view a visual replay of the failed test in the Playwright Trace Viewer.

## Future Phases

In later phases (Phase 12), we will expand this CI/CD setup to include:
- Automated deployment to a staging environment (e.g., Render or AWS).
- AI Failure Analysis: Automatically parsing failed CI logs and posting an LLM-generated root cause analysis as a comment on the Pull Request.
