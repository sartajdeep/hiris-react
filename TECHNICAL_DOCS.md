# HIRIS — Technical Documentation

> Internal reference for developers and contributors.

---

## Architecture Overview

HIRIS is a monorepo structured as:

| Layer | Location | Port |
|---|---|---|
| Unified React Frontend | `frontend/app/` | 5173 |
| Express REST API | `backend/` | 3001 |
| PostgreSQL Database | (local) | 5432 |
| Google Gemini AI | (cloud) | — |

---

## Frontend Architecture (`frontend/app/`)

### Design System

All styling is centralized in `src/index.css`. **No component-level CSS files exist.** All components rely on:

- **CSS Variables** for theming (light/dark mode)
- **`@import "tailwindcss"`** for utility classes (Tailwind v4 via Vite plugin)
- **Global classes** defined in `index.css`: `.btn-primary`, `.btn-secondary`, `.btn-white`, `.container`, `.section`, `.card`, `.badge-*`

#### Theme Variables

```css
/* Light Mode (default) */
--bg:             #F1F5F9
--surface:        #F8FAFC
--border:         #E2E8F0
--text-primary:   #0F172A
--text-secondary: #475569
--teal:           #28666E
--navy:           #0F172A

/* Dark Mode ([data-theme="dark"] override) */
--bg:             #0F172A
--surface:        #1E293B
--border:         #334155
--text-primary:   #F8FAFC
--navy:           #FFFFFF   /* inverted */
```

> **Rule**: Never use hardcoded hex values in component `style` props. Always reference a CSS variable.

---

### State & Auth

- **Auth**: `src/auth/AuthContext.jsx` — localStorage-backed. Users are stored under `hiris_users` and `hiris_invited_users`.
- **Theme**: `src/context/ThemeContext.jsx` — Persists to `localStorage`, applies `data-theme="dark"` to `<html>`.
- **Toast**: `src/context/ToastContext.jsx` — Global notification system.

---

### Routing (`App.jsx`)

All routes live in a single `BrowserRouter`. Protected routes use `<ProtectedRoute>` which checks `AuthContext`. Public routes (landing, login, signup, application form) are accessible without auth.

Role-based redirects after login:
- `chro@` → `/chro/dashboard`
- `hiring@` → `/hiring-assistant/dashboard`
- `professor@` or `faculty@` → `/professor/dashboard`
- everything else → `/hiring-assistant/dashboard`

---

### API Client (`src/api/client.js`)

Single source of truth for all HTTP calls:

```js
// Regular backend calls
getDashboardStats()
getHiringRequests(params)
getCandidates(params)
// ... etc.

// AI endpoints (routes to /api/ai/*)
generateJobDescription({ title, department, skills, location, notes })
sendAiChatMessage({ roleTitle, chatHistory, questionIndex })
completeAiChat()
getInterviewSuggestion({ transcript, rubricTraits, candidateName, roleTitle })
generateCandidateSummary({ candidateName, resumeData, jobDescription, roleTitle })
```

---

## Backend Architecture (`backend/`)

### Route Consolidation

The backend uses **4 domain-based route modules** (consolidated from 13 legacy files):

| File | Mounts At | Covers |
|---|---|---|
| `routes/core.js` | `/api` | Dashboard stats, Hiring Requests, Tasks, Agenda, Departments |
| `routes/assistant.js` | `/api` | Jobs, Active Openings, Admissions, Applications |
| `routes/chro.js` | `/api/chro` | CHRO KPIs, Approvals, Department Pipeline |
| `routes/candidates.js` | `/api` | Candidates CRUD, Interview Sessions |
| `routes/ai.js` | `/api/ai` | All Gemini AI endpoints |

---

### AI Routes (`routes/ai.js`)

Uses `@google/genai` SDK. The `GEMINI_API_KEY` is read from `backend/.env`.

| Endpoint | Input | Output |
|---|---|---|
| `POST /api/ai/generate-jd` | `{ title, department, skills, location, notes }` | `{ summary, responsibilities, qualifications, benefits }` |
| `POST /api/ai/chat-response` | `{ roleTitle, chatHistory, questionIndex }` | `{ message, isComplete }` |
| `POST /api/ai/complete-chat` | (none) | `{ message, isComplete: true }` |
| `POST /api/ai/interview-suggestion` | `{ transcript, rubricTraits, candidateName, roleTitle }` | `{ suggestion, rubricTrait, reason }` |
| `POST /api/ai/candidate-summary` | `{ candidateName, resumeData, jobDescription, roleTitle }` | `{ matchScore, matchLabel, summary, strengths, gaps }` |

All AI endpoints return clean JSON. The helper `parseJson()` strips markdown fences if the model wraps output in ` ```json ` blocks.

**Fallback behaviour**: If `GEMINI_API_KEY` is missing or the API call fails, the Interview Room falls back to `FALLBACK_SUGGESTIONS` (hardcoded) and the Candidate Chat returns a generic prompt. No crash occurs.

---

### Database

PostgreSQL via `pg` pool (`backend/db/pool.js`).

Key tables:

| Table | Description |
|---|---|
| `hiring_requests` | Department job requests |
| `job_roles` | Standard role templates |
| `active_openings` | Published live job postings |
| `applications` | Candidate submissions |
| `candidates` | Candidate records |
| `admissions` | Application tracking stages |
| `interview_sessions` | Interview verdicts & scores |
| `tasks` | Hiring assistant tasks |
| `agenda_events` | Calendar entries |
| `departments` | Department registry |

Full schema: `backend/db/schema.sql`

---

## Key Development Rules

1. **CSS**: All colours must use CSS variables. No hardcoded hex in component JSX.
2. **AI key**: Never expose `GEMINI_API_KEY` to the frontend. All AI calls go through the backend.
3. **Routes**: Add new features to the appropriate domain router (`core.js`, `assistant.js`, `chro.js`, `candidates.js`, `ai.js`). Do not create new route files.
4. **Components**: Shared UI lives in `src/components/shared/`. Landing UI lives in `src/components/landing-layout/`.
5. **API client**: All `fetch()` calls from the frontend must go through `src/api/client.js` — never inline fetch in page components (except legacy pages being migrated).

---

## Starting the Dev Environment

```bash
# Recommended — kills old processes, starts fresh
bash start_all.sh

# Or manually:
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend/app && npm run dev
```

---

## Known Limitations / Future Work

- **Bundle size**: The frontend bundle is ~610KB. Implement `React.lazy()` + `Suspense` code-splitting for page components to bring this below 500KB.
- **AI streaming**: Currently, Gemini responses are returned as full JSON blobs. For a better UX, migrate the chat endpoint to streaming (`generateContentStream()`).
- **Database auth**: PostgreSQL credentials are stored in `.env`. For production, use a secrets manager.
- **Real transcription**: The Interview Room uses a simulated transcript. In production, integrate a WebRTC + speech-to-text service (e.g. Deepgram) for real-time transcription.
