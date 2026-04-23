# HIRIS — Technical & API Documentation

This document outlines the technical architecture, API endpoints, and database schema for the HIRIS (Hiring and Recruitment Information System) platform.

## API Endpoints by Persona

The HIRIS backend (`localhost:3001`) serves tailored endpoints for each user persona.

### 1. Professor Persona (Faculty Portal)

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

### 2. CHRO Persona (Executive Portal)

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

### 3. Hiring Assistant Persona (Operations Portal)

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

## AI & Intelligent Services (Planned)

The following endpoints represent the AI-driven roadmap for HIRIS. These use OpenAI's APIs for structured evaluation and real-time interaction.

### Planned AI Workflow
1. When a candidate fills the application form, AI evaluates the profile against the role, rubric, and required qualifications.
2. After the candidate uploads the CV and resume, a brief AI chat takes place and the AI asks 2 follow-up questions based on the submitted documents.
3. When the CHRO interview begins, the conversation is recorded and transcribed live.
4. While the CHRO round is in progress, AI listens to the conversation, reads the uploaded rubric, and suggests relevant follow-up questions in real time.
5. After the interview, AI produces a structured summary, rubric-aligned score signals, and recommended next steps for the hiring team.

### Endpoints

| Function | Method | Endpoint | Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **JD Auto-Gen** | `POST` | `/api/ai/generate-jd` | ❌ | Automatically generate JD text from hiring request data. |
| **Application Evaluation** | `POST` | `/api/ai/evaluate-application` | `Planned` | Judge the applicant profile during form submission. |
| **Resume/CV Analysis** | `POST` | `/api/ai/analyze-documents` | `Planned` | Parse CV/resume and create structured summaries. |
| **Candidate AI Chat** | `POST` | `/api/ai/candidate-chat` | `Planned` | Start a brief AI conversation after document upload (2 questions). |
| **Talent Matching**| `GET` | `/api/ai/match-score/:id` | ❌ | Calculate candidate-role match percentage. |
| **Interview Transcription** | `POST` | `/api/ai/interview-transcription/session` | `Planned` | Record and transcribe the CHRO interview in real time. |
| **Interview Copilot** | `POST` | `/api/ai/interview-copilot/questions` | `Planned` | Listen to live CHRO interview and suggest follow-up questions. |
| **Interview Evaluation** | `POST` | `/api/ai/interview-copilot/evaluate` | `Planned` | Generate post-interview summary, strengths, and recommendation. |

### Recommended APIs
- **OpenAI Responses API** (`gpt-4o-mini` / `gpt-4o`): For application scoring, CV analysis, candidate chat, and high-stakes evaluations.
- **OpenAI Realtime API** (`gpt-4o-realtime-preview`): For live CHRO interview transcription and copilot reasoning.

---

## Full Database Table Reference (PostgreSQL)

### departments
Lookup table for academic or administrative departments.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | TEXT | Primary key (e.g. CS-01) |
| name | TEXT | Department name |

### professors
Stores professor records who request hires and review JDs/interviews.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | TEXT | Primary key |
| name | TEXT | Professor name |
| email | TEXT | Unique professor email |
| title | TEXT | Job title |
| department | TEXT | References departments(id) |
| phone | TEXT | Contact phone |
| linkedin_url | TEXT | LinkedIn URL |
| github_url | TEXT | GitHub URL |
| profile_notes | TEXT | Notes about the professor |
| created_at | TIMESTAMPTZ | Record creation timestamp |

### hiring_managers
Stores hiring manager and HR reviewer records.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | TEXT | Primary key |
| name | TEXT | Hiring manager name |
| email | TEXT | Unique email |
| title | TEXT | Job title |
| department | TEXT | References departments(id) |
| phone | TEXT | Contact phone |
| created_at | TIMESTAMPTZ | Creation timestamp |

### hiring_policies
Contains configured hiring policies, feature flags, and policy details.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| policy_key | TEXT | Unique policy identifier |
| title | TEXT | Policy title |
| description | TEXT | Policy description |
| active | BOOLEAN | Policy active state |
| features | JSONB | Feature list/details |
| created_at | TIMESTAMPTZ | Creation timestamp |

### pipelines
Defines pipeline stages used across hiring workflows.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| name | TEXT | Unique stage name |
| description | TEXT | Stage description |
| ordinal | INT | Stage order |

### hiring_requests
Kanban-style hiring request tracker from professor through approval.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | TEXT | Primary key |
| request_uid | TEXT | Unique UUID for the request |
| status | TEXT | Request status |
| title | TEXT | Request title |
| description | TEXT | Request description |
| location | TEXT | Job location |
| requested_by | TEXT | Originating user |
| professor_id | TEXT | References professors(id) |
| hiring_manager_id | TEXT | References hiring_managers(id) |
| department | TEXT | Department name |
| job_type | TEXT | Job type |
| positions | INT | Number of openings |
| start_date | TEXT | Start date |
| deadline | DATE | Application deadline |
| pipeline_stage | TEXT | Workflow stage |
| created_at | TIMESTAMPTZ | Creation timestamp |

### active_openings
Tracks active job postings and associated opening details.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | TEXT | Primary key |
| title | TEXT | Opening title |
| tag | TEXT | Job tag/category |
| department | TEXT | Department name |
| request_id | TEXT | References hiring_requests(id) |
| role_uid | TEXT | Unique role identifier |
| candidates | INT | Count of candidates |
| status | TEXT | Opening status |
| deadline | TEXT | Deadline label/text |
| is_open | BOOLEAN | Open/closed flag |
| created_at | TIMESTAMPTZ | Creation timestamp |

### tasks
Tracks dashboard to-dos and hiring assistant tasks.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| text | TEXT | Task description |
| priority | TEXT | High / Medium / Low |
| due_date | DATE | Due date |
| completed | BOOLEAN | Completion flag |
| created_at | TIMESTAMPTZ | Creation timestamp |

### agenda_events
Stores scheduled agenda cards for dashboard timeline.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| title | TEXT | Event title |
| subtitle | TEXT | Event subtitle |
| time_start | TEXT | Start time |
| time_end | TEXT | End time |
| time_label | TEXT | Display label |
| top_px | INT | UI top position |
| height_px | INT | UI height |
| variant | TEXT | Visual variant |
| event_date | DATE | Event date |

### candidates
Stores candidate metadata for the hiring cycle.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| candidate_uid | TEXT | Unique candidate UUID |
| name | TEXT | Candidate name |
| role_applied | TEXT | Applied role |
| applied_date | TEXT | Application date |
| ref_id | TEXT | Unique reference ID |
| email | TEXT | Candidate email |
| phone | TEXT | Candidate phone |
| location | TEXT | Candidate location |
| current_location | TEXT | Current location |
| linkedin_url | TEXT | LinkedIn profile |
| github_url | TEXT | GitHub profile |
| resume_path | TEXT | Resume file path |
| cv_path | TEXT | CV file path |
| status | TEXT | Candidate status |
| opening_id | TEXT | References active_openings(id) |
| skills | JSONB | Skill metadata |
| education_details | JSONB | Education details |
| academic_background | JSONB | Academic background |
| qa_responses | JSONB | QA responses |
| ai_summary | TEXT | AI interview summary |
| ai_match | TEXT | AI match label |
| resume_highlights | JSONB | Resume highlights |
| additional_questions | JSONB | Additional resume questions |
| professor_notes | TEXT | Professor notes |
| hr_notes | TEXT | HR notes |
| interview_at | TIMESTAMPTZ | Interview timestamp |
| created_at | TIMESTAMPTZ | Creation timestamp |

### applications
Public applicant submissions and application data.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| application_uid | TEXT | Unique application UUID |
| opening_id | TEXT | References active_openings(id) |
| request_id | TEXT | References hiring_requests(id) |
| professor_id | TEXT | References professors(id) |
| hiring_manager_id| TEXT | References hiring_managers(id) |
| candidate_uid | TEXT | Candidate UUID |
| source | TEXT | Source channel |
| full_name | TEXT | Applicant name |
| email | TEXT | Applicant email |
| phone | TEXT | Applicant phone |
| linkedin_url | TEXT | LinkedIn URL |
| github_url | TEXT | GitHub URL |
| cover_note | TEXT | Cover note |
| resume_path | TEXT | Resume file path |
| cv_path | TEXT | CV file path |
| token | TEXT | Applicant token |
| status | TEXT | Application status |
| education | JSONB | Education JSON data |
| submitted_at | TIMESTAMPTZ | Submission timestamp |

### candidate_profiles
Rich candidate profile records with full hiring data.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| candidate_uid | TEXT | Unique candidate UUID |
| application_id | INT | References applications(id) |
| hiring_request_id | TEXT | References hiring_requests(id) |
| opening_id | TEXT | References active_openings(id) |
| request_id | TEXT | Request reference |
| name | TEXT | Candidate name |
| email | TEXT | Candidate email |
| phone | TEXT | Candidate phone |
| current_location | TEXT | Current location |
| role_applied | TEXT | Role applied for |
| status | TEXT | Current status |
| ref_id | TEXT | Reference ID |
| linkedin_url | TEXT | LinkedIn URL |
| github_url | TEXT | GitHub URL |
| resume_path | TEXT | Resume path |
| cv_path | TEXT | CV path |
| cover_note | TEXT | Cover note |
| academic_background | JSONB | Academic background data |
| education_history | JSONB | Education history |
| skills | JSONB | Skills data |
| additional_questions | JSONB | Additional question responses |
| ai_interview_summary | TEXT | AI interview summary |
| chatbot_transcript | JSONB | Chatbot transcript |
| hiring_manager_notes | TEXT | Hiring manager notes |
| professor_notes | TEXT | Professor notes |
| hr_notes | TEXT | HR notes |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Update timestamp |

### admissions
Tracking applicant progress through admissions and screening.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| opening_id | TEXT | References active_openings(id) |
| candidate_id | INT | References candidates(id) |
| candidate_profile_id| INT | References candidate_profiles(id) |
| stage | TEXT | Admissions stage |
| score | INT | Score or rating |
| notes | TEXT | Notes |
| created_at | TIMESTAMPTZ | Creation timestamp |

### jd_reviews
Job description review and feedback history.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| opening_id | TEXT | References active_openings(id) |
| feedback | TEXT | Reviewer feedback |
| flags | JSONB | Review flags |
| reviewer_name | TEXT | Reviewer name |
| submitted_at | TIMESTAMPTZ | Submission timestamp |

### interview_sessions
Interview session records for professor and CHRO rounds.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| candidate_id | INT | References candidates(id) |
| candidate_profile_id | INT | References candidate_profiles(id) |
| transcript | JSONB | Interview transcript data |
| ai_scores | JSONB | AI score breakdown |
| ai_overall | DECIMAL(3,1) | AI overall score |
| manual_scores | JSONB | Manual scoring breakdown |
| manual_overall | DECIMAL(3,1) | Manual overall score |
| composite_score | DECIMAL(3,1) | Composite score |
| status | TEXT | Interview status |
| round_type | TEXT | Interview round type |
| reviewer_id | TEXT | Reviewer ID |
| conducted_at | TIMESTAMPTZ | Conducted timestamp |

### job_roles
Represents the role and its connection to a request, opening, and stakeholders.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | TEXT | Primary key |
| request_id | TEXT | References hiring_requests(id) |
| opening_id | TEXT | References active_openings(id) |
| title | TEXT | Role title |
| description | TEXT | Role description |
| department | TEXT | References departments(id) |
| professor_id | TEXT | References professors(id) |
| hiring_manager_id | TEXT | References hiring_managers(id) |
| stage | TEXT | Workflow stage |
| status | TEXT | Role status |
| created_at | TIMESTAMPTZ | Creation timestamp |

### job_descriptions
Drafts and review history for job descriptions.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| role_id | TEXT | References job_roles(id) |
| request_id | TEXT | References hiring_requests(id) |
| opening_id | TEXT | References active_openings(id) |
| author_type | TEXT | Author type |
| author_id | TEXT | Author identifier |
| version | INT | Draft version |
| content | TEXT | JD content |
| comments | JSONB | Reviewer comments |
| status | TEXT | Draft status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Update timestamp |

### candidate_rounds
Logs each round for every candidate in the pipeline.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| candidate_id | INT | References candidate_profiles(id) |
| round_type | TEXT | Round type |
| round_name | TEXT | Round name |
| status | TEXT | Round status |
| decision | TEXT | Proceed/reject/hold |
| decision_notes | TEXT | Decision notes |
| round_data | JSONB | Round-specific data |
| conducted_at | TIMESTAMPTZ | Conducted timestamp |
| created_at | TIMESTAMPTZ | Creation timestamp |

### candidate_assets
Stores resume/CV/LinkedIn/GitHub/profile asset links.
| Column | Type | Notes |
| :--- | :--- | :--- |
| id | SERIAL | Primary key |
| candidate_id | INT | References candidate_profiles(id) |
| asset_type | TEXT | Asset type |
| url | TEXT | Asset URL |
| caption | TEXT | Asset caption |
| uploaded_at | TIMESTAMPTZ | Upload timestamp |

### kpi_stats
Simple KPI cache table.
| Column | Type | Notes |
| :--- | :--- | :--- |
| key | TEXT | Primary key |
| value | INT | KPI numeric value |
| updated_at | TIMESTAMPTZ | Update timestamp |
