# Abi (Automated Business Intelligence)

Abi is an automated enterprise business intelligence platform built using LangGraph and Next.js. It connects to raw data sources, uses an autonomous Python REPL sandbox engine to run calculations live via Pandas, and streams beautiful data insights back to a React dashboard.

---

# Project Architecture Overview

The repository is structured as a monorepo consisting of two core blocks:

```text
/backend
```

FastAPI application executing the LangGraph multi-agent pipeline, intent router, and Python data evaluation sandbox.

```text
/web
```

Next.js (TypeScript) frontend UI rendering structured agent messages and responsive data components.

---

# Step-by-Step Setup Guide

Follow these steps to configure the database, environment variables, backend graph server, and frontend web app.

## 1. Database & External Provider Setup

1. Open pgAdmin (or your preferred PostgreSQL client).
2. Create a new local database
3. Ensure you have a valid Fireworks AI account and API key.

---

## 2. Environment Variables Configuration

Create two separate `.env` files.

### Backend

Create:

```text
/backend/.env
```

```env
FIREWORKS_API_KEY="your_fireworks_api_key_here"
DATABASE_URL="postgresql+asyncpg://postgres:your_password@localhost:5432/Abi"
```

> **Important**
>
> `DATABASE_URL` must use the `+asyncpg` driver:
>
> ```
> postgresql+asyncpg://
> ```
>
> Otherwise the backend will not connect asynchronously.

### Frontend

Create:

```text
/web/.env
```

```env
NEXT_PUBLIC_BACKEND_API="http://localhost:5000"
```

---

## 3. Backend Execution Pipeline

Abi uses **uv** for dependency management.

Navigate to the backend:

```bash
cd backend
```

Activate your virtual environment.

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
uv sync
```

Start the API:

```bash
uv run python -m api.main
```

The backend will be available at:

```text
http://localhost:5000
```

---

## 4. Seed an Active User Account

Authentication is currently database-backed, so you must manually create your first user.

1. Open:

```text
http://localhost:5000/docs
```

2. Locate the `auth/register` endpoint.

3. Click **Try it out**.

4. Fill in your credentials.

5. Click **Execute**.

This creates your user record.

Next, open pgAdmin and execute:

```sql
SELECT * FROM public."user";
```

Copy the value from the `id` column.

---

## 5. Frontend UI Deployment

Navigate to the frontend:

```bash
cd ../web
```

Install dependencies:

```bash
pnpm install
```

Approve native package builds if prompted:

```bash
pnpm approve-builds
```

Start the development server:

```bash
pnpm run dev
```

Open the application using your copied user ID:

```text
http://localhost:3000/?user_id=YOUR_COPIED_USER_ID
```

---

# 💡 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js App Router, TypeScript, Tailwind CSS |
| Backend | FastAPI |
| Agent Framework | LangGraph (StateGraph) |
| Checkpointing | InMemorySaver |
| LLM Provider | Fireworks AI |
| Data Processing | Pandas |
| Sandbox | Python REPL using `exec()` with captured `stdout` |
| Markdown Rendering | react-markdown + rehype-raw |

---
