# Architecture

## High-Level Architecture

The system consists of three main boundaries: the System Under Test (ShopSphere), the Testing Framework (Automation), and the Quality Platform (QualityPilot).

```mermaid
graph TD
    subgraph ShopSphere SUT
        Frontend[Next.js Frontend]
        Backend[FastAPI Backend]
        DB[(PostgreSQL)]
        Frontend --> Backend
        Backend --> DB
    end

    subgraph QualityPilot Platform
        QP_UI[Dashboard UI]
        QP_API[Platform API]
        AI[GenAI Service - Groq]
        QP_UI --> QP_API
        QP_API --> AI
    end

    subgraph Automation Engine
        Pytest[Pytest Runner]
        Playwright[Playwright UI Tests]
        APITests[API Tests]
        DBTests[Database Validation]
        
        Pytest --> Playwright
        Pytest --> APITests
        Pytest --> DBTests
    end
    
    QP_API --> Pytest
    Playwright -.-> Frontend
    APITests -.-> Backend
    DBTests -.-> DB
```

## Current Implementation (Phase 1)
Currently, only the `Backend` and `DB` of the ShopSphere SUT are implemented. The backend exposes a REST API via FastAPI and connects to PostgreSQL using SQLAlchemy.
