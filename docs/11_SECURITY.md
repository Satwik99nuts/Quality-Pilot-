# Security

*(To be updated as features are built)*

## Phase 1 Implementation
- Passwords are hashed using `bcrypt` via Passlib before hitting the database.
- Endpoints are secured using stateless JWTs (JSON Web Tokens).
- Environment variables (`.env`) are used to store the `SECRET_KEY` and DB credentials, ensuring they are not hardcoded in the repository.
