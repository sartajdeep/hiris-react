# HIRIS — Hiring & Recruitment Information System

> A full-stack, AI-powered hiring platform connecting **Candidates**, **Hiring Assistants**, **Professors/Evaluators**, and the **CHRO** through a unified, intelligent recruitment workflow.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Portals & Features](#portals--features)
- [AI Features](#ai-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Reference](#api-reference)
- [Port Map](#port-map)
- [User Flow](#user-flow)

---

## Overview

HIRIS is a multi-portal hiring platform that digitises and AI-assists every stage of the recruitment lifecycle — from job creation and candidate application, through AI-powered interviews, to final CHRO review and offer.

The system uses a **unified monolithic React frontend** (`frontend/app`) and a **single Express + PostgreSQL backend API** with domain-based routing, living together in one monorepo.

---

## Architecture

```
                    ┌─────────────────────────────────┐
                    │         HIRIS Monorepo           │
                    └─────────────────────────────────┘
                                    │
              ┌─────────────────────┴────────────────────┐
              │                                           │
   ┌──────────▼──────────┐                    ┌──────────▼──────────┐
   │   React Frontend    │                    │   Express Backend   │
   │   frontend/app      │  ──REST API──►     │   backend/          │
   │   :5173             │                    │   :3001             │
   └─────────────────────┘                    └──────────┬──────────┘
                                                         │
                                              ┌──────────▼──────────┐
                                              │     PostgreSQL       │
                                              │     Database         │
                                              └─────────────────────┘
                                                         │
                                              ┌──────────▼──────────┐
                                              │   Google Gemini AI   │
                                              │   (via @google/genai)│
                                              └─────────────────────┘
```

---

## Directory Structure

```
hiris-react/
│
├── frontend/
│   └── app/                           # Unified React Application (all portals)
│       ├── src/
│       │   ├── api/
│       │   │   └── client.js          # Centralised API + AI client
│       │   ├── auth/
│       │   │   ├── AuthContext.jsx    # Auth provider (localStorage-based)
│       │   │   └── ProtectedRoute.jsx
│       │   ├── components/
│       │   │   ├── landing-layout/    # Navbar, Footer for landing pages
│       │   │   └── shared/            # GlobalHeader, PortalLayout, ThemeToggle
│       │   ├── context/
│       │   │   ├── ThemeContext.jsx   # Light/dark mode
│       │   │   └── ToastContext.jsx   # Toast notifications
│       │   ├── pages/
│       │   │   ├── landing/           # Homepage, Pricing, Login, OrgSignup
│       │   │   │   └── onboarding/    # OrgSignup multi-step wizard
│       │   │   ├── chro/              # CHRO portal screens
│       │   │   ├── hiringassistant/   # Hiring Assistant screens
│       │   │   ├── professor/         # Faculty/Evaluator screens
│       │   │   └── candidate/         # Candidate application flow
│       │   ├── App.jsx                # Root router
│       │   ├── index.css              # Global design system
│       │   └── main.jsx
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── backend/                           # Express + PostgreSQL REST API
│   ├── db/
│   │   ├── pool.js                    # PostgreSQL connection pool
│   │   ├── schema.sql                 # Full table definitions
│   │   └── seed.js                    # Sample data seeding
│   ├── routes/
│   │   ├── core.js                    # Dashboard, Tasks, Agenda, Departments
│   │   ├── assistant.js               # Jobs, Admissions, Openings, Applications
│   │   ├── chro.js                    # CHRO KPIs, Approvals, Pipeline
│   │   ├── candidates.js              # Candidate records & interview sessions
│   │   └── ai.js                      # 🤖 Gemini AI endpoints
│   ├── server.js                      # Express app entry point
│   ├── .env                           # Credentials (git-ignored)
│   └── package.json
│
├── start_all.sh                       # One-command dev startup script
├── README.md
├── FEATURES.md
└── TECHNICAL_DOCS.md
```

---

## Portals & Features

### Landing & Onboarding (`:5173`)

| Screen | Route | Description |
|---|---|---|
| Home | `/` | Marketing landing page |
| Pricing | `/pricing` | Pricing tiers |
| Login | `/login` | Single sign-in for all roles |
| Org Signup | `/signup` | 4-step onboarding wizard |

### CHRO Portal (`:5173/chro/*`)

| Screen | Route | Description |
|---|---|---|
| Dashboard | `/chro/dashboard` | Company-wide hiring overview |
| Hiring Requests | `/chro/requests` | Review all department requests |
| Interview Room | `/chro/interview-room/:id` | 🤖 AI-powered live interview |
| Hiring Policies | `/chro/policies` | Manage HR policies |
| Job Roles | `/chro/job-roles` | Browse/manage roles |
| Analytics | `/chro/analytics` | Hiring analytics & charts |
| Team Management | `/chro/team` | Manage users & roles |

### Hiring Assistant Portal (`:5173/hiring-assistant/*`)

| Screen | Route | Description |
|---|---|---|
| Dashboard | `/hiring-assistant/dashboard` | Task, agenda & KPIs |
| Hiring Requests | `/hiring-assistant/requests` | View/manage open requests |
| Job Posting Builder | `/hiring-assistant/job-posting-builder` | 🤖 AI-assisted JD creation |
| Active Openings | `/hiring-assistant/active-openings` | Browse live postings |
| Admissions | `/hiring-assistant/admissions` | Manage incoming applications |
| Candidate Profile | `/hiring-assistant/candidate-profile/:id` | Full candidate view |

### Professor / Faculty Portal (`:5173/professor/*`)

| Screen | Route | Description |
|---|---|---|
| Dashboard | `/professor/dashboard` | Candidate queue |
| JD Review | `/professor/jd-review` | Review & approve JDs |
| Interview Room | `/professor/interview/:id` | Conduct technical interview |
| Candidate Profile | `/professor/candidate/:id` | Deep candidate assessment |

### Candidate Portal (`:5173/*`)

| Screen | Route | Description |
|---|---|---|
| Application Form | `/application-form` | Multi-step job application |
| AI Chat | `/ai-chat` | 🤖 Dynamic AI pre-screening |
| Thank You | `/thank-you-for-applying` | Post-submission confirmation |

---

## AI Features

HIRIS integrates Google Gemini AI via a dedicated backend route (`/api/ai/*`). All AI calls are server-side — the API key never reaches the browser.

| Feature | Endpoint | Where Used |
|---|---|---|
| ✨ Job Description Generation | `POST /api/ai/generate-jd` | Hiring Assistant → Job Builder |
| 🤖 Dynamic Candidate Chat | `POST /api/ai/chat-response` | Candidate → AI Pre-screening |
| 🎯 Live Interview Suggestions | `POST /api/ai/interview-suggestion` | CHRO / Professor Interview Room |
| 📋 Candidate Summary | `POST /api/ai/candidate-summary` | Candidate Profile views |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| Styling | TailwindCSS v4 + Vanilla CSS Design System |
| UI Icons | Material Symbols Outlined + Lucide React |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| Backend | Node.js + Express 4 |
| Database | PostgreSQL (via `pg` pool) |
| File Uploads | Multer |
| API Docs | Swagger UI (`/api-docs`) |
| Dev Server | Nodemon (backend) / Vite HMR (frontend) |

---

## Prerequisites

- **Node.js** v18+ and **npm** v9+
- **PostgreSQL** v14+ running locally
- **Google Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com))

---

## Database Setup

1. Create a PostgreSQL database named `hiris`:
   ```sql
   CREATE DATABASE hiris;
   ```

2. Apply the schema:
   ```bash
   psql -U postgres -d hiris -f backend/db/schema.sql
   ```

3. (Optional) Seed with sample data:
   ```bash
   cd backend && npm run seed
   ```

---

## Environment Variables

Create / update `backend/.env`:

```env
# backend/.env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/hiris
PORT=3001
FRONTEND_URL=http://localhost:5173

# AI Integration (required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Never commit `.env` to version control.** It is already listed in `.gitignore`.

---

## Running the Project

### Option A — One Command (recommended)

```bash
# From repo root
bash start_all.sh
```

This script will:
1. **Kill** any existing processes on ports 3001 and 5173
2. Auto-run `npm install` in any directory missing `node_modules`
3. Start backend and frontend concurrently
4. Print all URLs
5. Warn if `GEMINI_API_KEY` is not configured
6. Gracefully stop everything with `Ctrl+C`

---

### Option B — Manual (two terminals)

```bash
# Terminal 1 — Backend API
cd backend
npm install
npm run dev

# Terminal 2 — Frontend (all portals)
cd frontend/app
npm install
npm run dev
```

---

## API Reference

All API endpoints are served from `http://localhost:3001`.  
Interactive Swagger docs: **http://localhost:3001/api-docs**

### Domain Routers

| Base Path | Router File | Covers |
|---|---|---|
| `GET /api/health` | inline | Health check |
| `/api/*` | `core.js` | Dashboard, Tasks, Agenda, Departments, Hiring Requests |
| `/api/*` | `assistant.js` | Jobs, Active Openings, Admissions, Applications |
| `/api/chro/*` | `chro.js` | CHRO KPIs, Approvals, Department Pipeline |
| `/api/candidates/*` | `candidates.js` | Candidate records, Interview Sessions |
| `/api/ai/*` | `ai.js` | Gemini AI — JD gen, chat, interview suggestions, candidate summary |

---

## Port Map

| Service | URL |
|---|---|
| HIRIS Platform (all portals) | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| API Docs (Swagger) | http://localhost:3001/api-docs |

---

## User Flow

```
CANDIDATE
  └─► /application-form  →  /ai-chat (🤖 AI screening)  →  /thank-you-for-applying
                                          │
                                (application submitted to DB)
                                          │
HIRING ASSISTANT                          ▼
  └─► /admissions  →  /candidate-profile  →  (shortlist)
                                          │
                              (hiring request approved)
                                          │
PROFESSOR                                 ▼
  └─► /jd-review  →  /interview/:id (conduct interview)  →  /candidate/:id
                                          │
                                 (verdict submitted)
                                          │
CHRO                                      ▼
  └─► /chro/requests  →  /chro/interview-room/:id (🤖 AI live suggestions)
                                          │
                                  (final decision)
```

---

## License

© HIRIS Team  
Smriti Kinra · Sartajdeep Singh · Gracy Tanna