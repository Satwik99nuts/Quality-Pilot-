# Project Overview

QualityPilot is an AI-Powered Test Automation & Quality Engineering Platform built alongside a sample e-commerce application called "ShopSphere" (the System Under Test). 

The goal of this project is to demonstrate professional Software Development Engineer in Test (SDET) skills, including backend/frontend development, automated UI/API/Database testing, CI/CD, and the novel integration of GenAI for test generation and failure analysis.

## Core Problem
Modern applications require repeated regression testing. Manual testing is time-consuming, repetitive, and difficult to scale. While automated testing solves this, maintaining tests and diagnosing failures is still expensive. 

QualityPilot demonstrates how deterministic automated testing (Playwright, Pytest) can be combined with GenAI to reduce repetitive test generation and failure analysis effort, while maintaining deterministic validation (i.e., the LLM does not decide if a test passes or fails).

## Major Components
1. **ShopSphere:** The e-commerce System Under Test (SUT).
2. **QualityPilot Dashboard:** The frontend for viewing and managing tests.
3. **Execution Engine:** Runs tests deterministically.
4. **AI Assistants:** Generates tests and analyzes failures via LLM (Groq).

## Development Approach
The project follows a 13-phase incremental development strategy, emphasizing clean architecture, maintainability, and interview explainability.
