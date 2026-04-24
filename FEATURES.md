# HIRIS — Feature Catalogue

Complete list of all implemented features across every portal.

---

## 🌐 Landing & Onboarding

| Feature | Status | Notes |
|---|---|---|
| Marketing homepage (Hero, Stats, Features, Pipeline, AI Highlight, CTA) | ✅ | `pages/landing/HomePage.jsx` |
| Pricing page | ✅ | `pages/landing/PricingPage.jsx` |
| Unified login page (email + SSO) | ✅ | `pages/landing/LoginPage.jsx` |
| Role-based redirect after login | ✅ | Auth reads email pattern to determine portal |
| Demo accounts (pre-filled on login page) | ✅ | `chro@hiris.com`, `hiring@hiris.com`, `faculty@hiris.com` |
| 4-step Organisation Signup Wizard | ✅ | `pages/landing/onboarding/OrgSignup.jsx` |
| — Step 1: Organisation details (name, URL, industry, size) | ✅ | |
| — Step 2: Define roles & permissions | ✅ | Toggle permissions per role |
| — Step 3: Invite team members | ✅ | Saves to localStorage for login |
| — Step 4: Confirmation with portal links | ✅ | |
| Light/Dark mode toggle | ✅ | Persisted to localStorage |
| Times New Roman "H" logo across all navbars | ✅ | |

---

## 🏢 CHRO Portal

| Feature | Status | Notes |
|---|---|---|
| Dashboard with KPI cards (open positions, applications, time-to-fill, offer rate) | ✅ | `CHRODashboard.jsx` |
| Pending approvals panel | ✅ | |
| Department pipeline chart | ✅ | |
| Hiring Requests review | ✅ | `HiringRequests.jsx` |
| Hiring Policies management | ✅ | `HiringPolicies.jsx` |
| Job Roles browser | ✅ | `JobRoles.jsx` |
| Analytics page | ✅ | `Analytics.jsx` |
| Team Management (invite, role assignment) | ✅ | `TeamManagement.jsx` |
| **AI Interview Room** | ✅ | `InterviewRoomCHRO.jsx` |
| — Live transcript simulation | ✅ | |
| — Real-time AI follow-up suggestions (Gemini) | ✅ | `POST /api/ai/interview-suggestion` |
| — Rubric coverage tracker | ✅ | |
| — Post-interview scoring & feedback | ✅ | |
| — Accept / Hold / Reject decision | ✅ | |
| Profile Settings modal | ✅ | |
| Dark mode full coverage | ✅ | All hardcoded colours replaced with CSS variables |

---

## 🗂️ Hiring Manager Portal

| Feature | Status | Notes |
|---|---|---|
| Dashboard with tasks, agenda, and KPIs | ✅ | `Dashboard.jsx` |
| Hiring Requests list & management | ✅ | `HiringRequests.jsx` |
| **Job Posting Builder** | ✅ | `JobPostingBuilder.jsx` |
| — ✨ AI-generated job description (Gemini) | ✅ | `POST /api/ai/generate-jd` |
| — Rich text editor (bold, italic, lists) | ✅ | |
| — Required skills tag manager | ✅ | |
| — Drag-and-drop interview stage builder | ✅ | |
| — Custom screening question builder | ✅ | |
| — Send for Faculty approval | ✅ | |
| Active Openings browser | ✅ | `ActiveOpenings.jsx` |
| Admissions / candidate pipeline | ✅ | `Admissions.jsx` |
| Candidate Profile deep-dive | ✅ | `CandidateProfile.jsx` |
| Approval Submitted confirmation | ✅ | |

---

## 🎓 Professor / Faculty Portal

| Feature | Status | Notes |
|---|---|---|
| Dashboard with candidate queue | ✅ | `ProfessorDashboard.jsx` |
| Hiring request submission form | ✅ | Modal within dashboard |
| JD Review screen | ✅ | `ProfessorJDReview.jsx` |
| Candidate Profile with AI summary | ✅ | `ProfessorCandidateProfile.jsx` |
| AI screening transcript viewer | ✅ | |
| Interview Room with rubric scoring | ✅ | `ProfessorInterviewRoom.jsx` |
| Trait-by-trait evaluation form | ✅ | |
| Verdict submission (Shortlist / Hold / Reject) | ✅ | |

---

## 🙋 Candidate Portal

| Feature | Status | Notes |
|---|---|---|
| Multi-step Application Form | ✅ | `ApplicationForm.jsx` |
| Resume / CV file upload | ✅ | Multer backend |
| **AI Pre-screening Chat (Gemini)** | ✅ | `AiChat.jsx` |
| — Dynamic questions adapting to answers | ✅ | `POST /api/ai/chat-response` |
| — Animated typing indicator | ✅ | |
| — Progress counter (Q1/3, Q2/3 …) | ✅ | |
| Thank You confirmation screen | ✅ | `ThankYouForApplying.jsx` |

---

## 🤖 AI Features (Gemini 2.0 Flash)

| Feature | Endpoint | Portal |
|---|---|---|
| Job Description Generation | `POST /api/ai/generate-jd` | Hiring Manager |
| Dynamic Candidate Pre-screening | `POST /api/ai/chat-response` | Candidate |
| Live Interview Suggestions | `POST /api/ai/interview-suggestion` | CHRO, Professor |
| Candidate Match Summary | `POST /api/ai/candidate-summary` | Any profile view |

All AI is **server-side only** — the Gemini API key never reaches the browser.

---

## 🛠️ Infrastructure & DevEx

| Feature | Status |
|---|---|
| `start_all.sh` — one-command startup | ✅ (kills stale ports, warns on missing API key) |
| Nodemon backend hot-reload | ✅ |
| Vite HMR frontend hot-reload | ✅ |
| Swagger API docs at `/api-docs` | ✅ |
| PostgreSQL schema + seed script | ✅ |
| CORS configured for localhost dev | ✅ |
| Multer file upload to `/uploads` | ✅ |
| Light + Dark mode CSS variable system | ✅ |
| Global Toast notification system | ✅ |
| Auth context (localStorage) | ✅ |
