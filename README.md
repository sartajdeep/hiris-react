# HIRIS — Hiring and Recruitment Information System

HIRIS is an integrated platform designed to streamline academic and staff recruitment. It features specialized dashboards for various organizational personas and a centralized intelligent backend.

## 🚀 Getting Started

To launch the entire HIRIS ecosystem including the API and all three dashboard portals, use the provided batch script:

1. Open a terminal in the project root.
2. Run `start_all.bat`.

### 📍 Access Points
- **Hiring Assistant**: [http://localhost:5173](http://localhost:5173)
- **Professor Dashboard**: [http://localhost:5174](http://localhost:5174)
- **CHRO Insights**: [http://localhost:5175](http://localhost:5175)
- **API Server**: [http://localhost:3001](http://localhost:3001)

---

## 👨‍🏫 Professor Persona (Faculty Portal)

| Function | Method | Endpoint | Verified | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `GET` | `/api/candidates` | ✅ | List candidates for professor review. |
| | `GET` | `/api/candidates/:id` | ✅ | Fetch detailed candidate profile. |
| | `PATCH` | `/api/candidates/:id/status` | ✅ | Update status / schedule interviews. |
| | `GET` | `/api/hiring-requests` | ✅ | Track departmental requisitions. |
| | `POST` | `/api/hiring-requests` | ✅ | Initiate a new hire request. |
| | `PATCH` | `/api/hiring-requests/:id/status`| ✅ | Finalize request for approval. |
| | `PATCH` | `/api/hiring-requests/:id` | ✅ | Modify request details. |
| **JD Review** | `GET` | `/api/jd-reviews/:opening_id` | ✅ | View JD feedback history. |
| | `POST` | `/api/jd-reviews/:opening_id` | ✅ | Submit feedback on JD drafts. |
| **Interview** | `POST` | `/api/interview-sessions` | ✅ | Submit scores and transcripts. |
| | `GET` | `/api/interview-sessions/:cand_id`| ✅ | Fetch candidate interview history. |

---

## 👑 CHRO Persona (Executive Portal)

| Function | Method | Endpoint | Verified | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `GET` | `/api/chro/kpis` | ✅ | Executive high-level metrics. |
| | `GET` | `/api/chro/approvals` | ✅ | Pending requisitions awaiting sign-off. |
| | `GET` | `/api/chro/department_pipeline`| ✅ | Pipeline health by academic unit. |
| | `PATCH` | `/api/chro/headcount/:id/status`| ✅ | Approve/Reject headcount requests. |
| **Job Roles** | `GET` | `/api/jobs` | ✅ | Organizational role audit. |
| | `POST` | `/api/jobs` | ✅ | Create new job roles. |
| | `PATCH` | `/api/jobs/:id` | ✅ | Update role entities. |
| | `DELETE`| `/api/jobs/:id` | ✅ | Remove obsolete roles. |

---

## 💼 Hiring Assistant Persona (Operations Portal)

| Function | Method | Endpoint | Verified | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `GET` | `/api/dashboard/stats` | ✅ | Operational metrics and KPIs. |
| | `GET` | `/api/tasks` | ✅ | List to-do items. |
| | `POST` | `/api/tasks` | ✅ | Create new task. |
| | `PATCH` | `/api/tasks/:id/complete` | ✅ | Archive completed tasks. |
| | `GET` | `/api/agenda` | ✅ | Synchronized calendar events. |
| **Admissions** | `GET` | `/api/admissions` | ✅ | Track applicants through screening. |
| | `GET` | `/api/admissions/stats` | ✅ | Conversion rates by opening. |
| | `PATCH` | `/api/admissions/:id/stage` | ✅ | Move candidate across pipeline stages. |
| **Openings** | `GET` | `/api/active-openings` | ✅ | List all live postings. |
| | `PATCH` | `/api/active-openings/:id/close`| ✅ | Deactivate application link. |
| | `PATCH` | `/api/active-openings/:id/candidate-count`| ✅ | Metric sync for new applicants. |

---

## 🔮 AI & Intelligent Services (Planned / Not Implemented)

The following endpoints represent the AI-driven roadmap for HIRIS. These are currently **Not Implemented** in the core API but are reserved for future integration.

| Function | Method | Endpoint | Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **JD Auto-Gen** | `POST` | `/api/ai/generate-jd` | ❌ | Automatically generate JD text from hiring request data. |
| **Resume Parser**| `POST` | `/api/ai/analyze-resume`| ❌ | AI parsing of PDF resumes into candidate profile fields. |
| **Talent Matching**| `GET` | `/api/ai/match-score/:id` | ❌ | Calculate candidate-role match percentage using LLMs. |
| **Interview AI** | `POST` | `/api/ai/summarize` | ❌ | Post-interview transcript summarization and sentiment analysis. |

---

## 🗄️ Full Database Table Index (PostgreSQL)

| ID | Table Name | Purpose |
| :--- | :--- | :--- |
| 01 | **departments** | Faculty and Organizational structure. |
| 02 | **professors** | Requesting and Reviewing stakeholders. |
| 03 | **hiring_managers** | Operational HR stakeholders. |
| 10 | **candidates** | Unified talent records. |
| 12 | **candidate_profiles**| Rich talent repository (AI + Assets). |
| 06 | **hiring_requests** | The core requisition tracker. |
| 07 | **active_openings** | Live job boards data. |
| 15 | **interview_sessions**| Scoring and transcripts. |

*(Total 20 tables verified in the backend schema)*

---
*Last updated: April 10, 2026*
