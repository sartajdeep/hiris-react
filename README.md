# HIRIS — Hiring & Recruitment Information System

> A full-stack AI-assisted hiring platform connecting **Candidates**, **Hiring Managers**, **Professors/Evaluators**, and the **CHRO** through a unified recruitment workflow.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Portals & Features](#portals--features)
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

The system is split into **three React frontends** and **one shared Express + PostgreSQL backend API**, all living in a single monorepo.

---

## Architecture

```
                    ┌─────────────────────────────────┐
                    │         HIRIS Monorepo           │
                    └─────────────────────────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           │                        │                        │
   ┌───────▼───────┐      ┌─────────▼──────┐      ┌────────▼────────┐
   │  Hiring Asst  │      │  CHRO Portal   │      │Professor Portal │
   │  + Candidate  │      │  (React/Vite)  │      │  (React/Vite)   │
   │  (React/Vite) │      │  :5175         │      │  :5174          │
   │  :5173        │      └───────┬────────┘      └────────┬────────┘
   └───────┬───────┘              │                        │
           │                      │                        │
           └──────────────────────┼────────────────────────┘
                                  │  REST API calls
                          ┌───────▼───────┐
                          │  Express API  │
                          │  (Node.js)    │
                          │  :3001        │
                          └───────┬───────┘
                                  │
                          ┌───────▼───────┐
                          │  PostgreSQL   │
                          │  Database     │
                          └───────────────┘
```

---

## Directory Structure

```
hiris-react/
│
├── frontend/
│   ├── hiring-assistant/          # Hiring Manager + Candidate Portal
│   │   ├── src/
│   │   │   ├── api/               # API client (axios wrapper)
│   │   │   ├── components/
│   │   │   │   ├── layout/        # Header, Footer, Breadcrumb
│   │   │   │   ├── dashboard/     # Task, Agenda widgets
│   │   │   │   └── hiring/        # Kanban, RequestCard
│   │   │   ├── data/              # Static/mock data files
│   │   │   ├── hooks/             # useLiveClock, useTasks
│   │   │   ├── pages/
│   │   │   │   ├── hiringassistant/  # 11 hiring manager screens
│   │   │   │   └── candidateapplicationform/  # 3 candidate screens
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── chro/                      # CHRO (Chief HR Officer) Portal
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── Layout.jsx     # Sidebar + header shell
│   │   │   │   └── ToastContext.jsx
│   │   │   ├── pages/chro/        # 8 CHRO screens
│   │   │   │   ├── CHRODashboard.jsx
│   │   │   │   ├── InterviewRoomCHRO.jsx  # AI interview room
│   │   │   │   ├── HiringRequests.jsx
│   │   │   │   ├── HiringPolicies.jsx
│   │   │   │   ├── JobRoles.jsx
│   │   │   │   ├── AssignManagers.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   └── Settings.jsx
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   │
│   └── professor/                 # Professor / Evaluator Portal
│       ├── src/
│       │   ├── api/
│       │   ├── components/layout/
│       │   ├── hooks/
│       │   ├── pages/professor/   # 4 professor screens
│       │   │   ├── ProfessorDashboard.jsx
│       │   │   ├── ProfessorCandidateProfile.jsx
│       │   │   ├── ProfessorJDReview.jsx
│       │   │   └── ProfessorInterviewRoom.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── backend/                       # Express + PostgreSQL REST API
│   ├── db/
│   │   ├── pool.js                # PostgreSQL connection pool
│   │   ├── schema.sql             # Full table definitions
│   │   └── seed.js                # Sample data seeding
│   ├── middleware/
│   │   └── upload.js              # Multer file upload config
│   ├── routes/
│   │   ├── dashboard.js
│   │   ├── hiringRequests.js
│   │   ├── tasks.js
│   │   ├── agenda.js
│   │   ├── activeOpenings.js
│   │   ├── candidates.js
│   │   ├── admissions.js
│   │   ├── applications.js
│   │   ├── departments.js
│   │   ├── jdReviews.js
│   │   ├── interviewSessions.js
│   │   ├── jobs.js
│   │   └── chro.js
│   ├── server.js                  # Express app entry point
│   ├── .env                       # DB credentials (git-ignored)
│   └── package.json
│
├── start_all.sh                   # One-command dev startup script
└── README.md
```

---

## Portals & Features

### 1. Hiring Assistant (`frontend/hiring-assistant/`) — Port 5173
Used by **Hiring Managers** to manage the full recruitment pipeline.

| Screen | Route | Description |
|---|---|---|
| Dashboard | `/` | Overview with tasks, agenda, KPIs |
| Hiring Requests | `/hiring-requests` | View/manage open requests |
| Job Posting Builder | `/job-posting-builder` | Create a job description |
| Publish | `/publish` | Review & publish the JD |
| Job Posted | `/job-posted` | Confirmation screen |
| Active Openings | `/active-openings` | Browse live postings |
| Admissions | `/admissions` | Manage incoming applications |
| Admissions Edit | `/admissions/edit` | Edit an existing posting |
| Application Details | `/application-details` | Deep-dive one application |
| Candidate Profile | `/candidate-profile` | Full candidate profile |
| Approval Submitted | `/approval-submitted` | Post-approval confirmation |

**Candidate-facing screens** (embedded in same app):

| Screen | Route | Description |
|---|---|---|
| Application Form | `/application-form` | Multi-step job application |
| AI Chat | `/ai-chat` | AI assistant during application |
| Thank You | `/thank-you` | Post-submission confirmation |

---

### 2. CHRO Portal (`frontend/chro/`) — Port 5175
Used by the **Chief Human Resources Officer** for executive oversight.

| Screen | Route | Description |
|---|---|---|
| Dashboard | `/` | Company-wide hiring overview |
| Interview Room | `/chro/interview-room/:candidateId` | AI-powered live interview |
| Hiring Requests | `/chro/requests` | Review all requests |
| Hiring Policies | `/chro/policies` | Manage HR policies |
| Job Roles | `/chro/job-roles` | Browse/manage roles |
| Assign Managers | `/chro/assign-managers` | Assign HMs to roles |
| Analytics | `/chro/analytics` | Hiring analytics & charts |
| Settings | `/chro/settings` | Account & system config |

---

### 3. Professor Portal (`frontend/professor/`) — Port 5174
Used by **academic evaluators** to assess candidates and review JDs.

| Screen | Route | Description |
|---|---|---|
| Dashboard | `/` | Candidate queue overview |
| JD Review | `/jd-review` | Review job descriptions |
| JD Review (role) | `/jd-review/:roleId` | Role-specific JD review |
| Interview Room | `/interview/:roleId` | Conduct an interview |
| Candidate Profile | `/candidate/:id` | Deep candidate assessment |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18/19 + Vite |
| Routing | React Router v6/v7 |
| Styling | TailwindCSS + Vanilla CSS |
| UI Icons | Lucide React |
| Backend | Node.js + Express 4 |
| Database | PostgreSQL (via `pg` pool) |
| File Uploads | Multer |
| API Docs | Swagger UI (`/api-docs`) |
| Dev Server | Nodemon (backend) / Vite HMR (frontend) |

---

## Prerequisites

- **Node.js** v18+ and **npm** v9+
- **PostgreSQL** v14+ running locally
- **Git**

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

Create a `.env` file inside `backend/` (already present from migration):

```env
# backend/.env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/hiris
PORT=3001
FRONTEND_URL=http://localhost:5173
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
1. Auto-run `npm install` in any directory missing `node_modules`
2. Start all 4 services concurrently in the background
3. Print all URLs
4. Gracefully stop everything with `Ctrl+C`

---

### Option B — Manual (run each in a separate terminal)

```bash
# Terminal 1 — Backend API
cd backend
npm install
npm run dev

# Terminal 2 — Hiring Assistant + Candidate Portal
cd frontend/hiring-assistant
npm install
npm run dev

# Terminal 3 — Professor Portal
cd frontend/professor
npm install
npm run dev

# Terminal 4 — CHRO Portal
cd frontend/chro
npm install
npm run dev
```

---

## API Reference

All API endpoints are served from `http://localhost:3001`.  
Interactive Swagger docs: **http://localhost:3001/api-docs**

| Base Path | Route File | Description |
|---|---|---|
| `GET /api/health` | inline | Health check |
| `/api/dashboard` | `dashboard.js` | Dashboard stats |
| `/api/hiring-requests` | `hiringRequests.js` | Create/approve/reject requests |
| `/api/tasks` | `tasks.js` | Task management |
| `/api/agenda` | `agenda.js` | Interview agenda events |
| `/api/active-openings` | `activeOpenings.js` | Live job listings |
| `/api/candidates` | `candidates.js` | Candidate records |
| `/api/admissions` | `admissions.js` | Application tracking |
| `/api/applications` | `applications.js` | Application submissions |
| `/api/departments` | `departments.js` | Department data |
| `/api/jd-reviews` | `jdReviews.js` | JD review workflow |
| `/api/interview-sessions` | `interviewSessions.js` | Interview session data |
| `/api/jobs` | `jobs.js` | Job postings CRUD |
| `/api/chro` | `chro.js` | CHRO-specific operations |

---

## Port Map

| Service | URL |
|---|---|
| Backend API | http://localhost:3001 |
| API Docs (Swagger) | http://localhost:3001/api-docs |
| Hiring Assistant + Candidate Portal | http://localhost:5173 |
| Professor / Evaluator Portal | http://localhost:5174 |
| CHRO Portal | http://localhost:5175 |

---

## User Flow

```
CANDIDATE
  └─► /application-form  →  /ai-chat  →  /thank-you
                                              │
                                    (application submitted)
                                              │
HIRING MANAGER                                ▼
  └─► /admissions  →  /application-details  →  /candidate-profile
                                              │
                                     (request approved)
                                              │
CHRO                                          ▼
  └─► /chro/requests  →  /chro/interview-room/:candidateId
                                              │
                                     (final evaluation)
                                              │
PROFESSOR                                     ▼
  └─► /jd-review/:roleId  →  /interview/:roleId  →  /candidate/:id
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

© HIRIS Team
Smriti Kinra
Sartajdeep Singh
Gracy Tanna