# HIRIS - Hiring & Recruitment Information System

HIRIS is a full-stack hiring platform with a shared Express/PostgreSQL backend and four React/Vite frontends:

- Landing website: organisation signup, pricing, and login at `http://localhost:5176`
- Hiring Manager portal: hiring requests, job posting, admissions, and candidate screens at `http://localhost:5173`
- Faculty portal: JD reviews, candidate review, and interviews at `http://localhost:5174`
- CHRO portal: hiring overview, policies, roles, team management, analytics, and final interviews at `http://localhost:5175`

The backend stays shared across all portals at `http://localhost:3001`.

## Current Structure

```text
hiris-react/
├── backend/
│   ├── db/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── landing/
│   ├── hiring-assistant/
│   ├── professor/
│   ├── chro/
│   └── _archive/
│       └── app-unified/   # Archived older single-app UI, not used by start_all.sh
├── start_all.sh
├── FEATURES.md
└── TECHNICAL_DOCS.md
```

## Running The Project

From the project root:

```bash
bash start_all.sh
```

The script clears the expected local ports, installs missing dependencies, and starts:

```text
Backend API          http://localhost:3001
Hiring Manager     http://localhost:5173
Professor Portal     http://localhost:5174
CHRO Portal          http://localhost:5175
Landing Website      http://localhost:5176
```

## Manual Commands

Install dependencies for one app:

```bash
cd frontend/landing
npm install
```

Build one app:

```bash
npm run build
```

Useful build checks:

```bash
cd frontend/landing && npm run build
cd frontend/hiring-assistant && npm run build
cd frontend/professor && npm run build
cd frontend/chro && npm run build
```

## Demo Accounts

Use the landing login page at `http://localhost:5176/login`.

```text
CHRO                smriti.kinra@hiris.demo
Hiring Manager    sartajdeep.singh@hiris.demo
Faculty Portal      gracy.tanna@hiris.demo
```

## Notes

- All portals call the same backend API on port `3001`.
- Dark mode is driven by `hiris_theme` in `localStorage` and `data-theme` on the document root.
- The old unified React app has been archived locally under `frontend/_archive/app-unified` and is not part of the active startup flow.
