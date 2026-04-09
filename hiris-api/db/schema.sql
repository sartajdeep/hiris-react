CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Departments lookup
CREATE TABLE IF NOT EXISTS departments (
  id   TEXT PRIMARY KEY,   -- e.g. 'CS-01'
  name TEXT NOT NULL
);

-- Professors who request hires and review JDs/interviews
CREATE TABLE IF NOT EXISTS professors (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  title        TEXT,
  department   TEXT REFERENCES departments(id),
  phone        TEXT,
  linkedin_url TEXT,
  github_url   TEXT,
  profile_notes TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Hiring managers and HR reviewers
CREATE TABLE IF NOT EXISTS hiring_managers (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  title        TEXT,
  department   TEXT REFERENCES departments(id),
  phone        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Configured hiring policies and feature flags
CREATE TABLE IF NOT EXISTS hiring_policies (
  id           SERIAL PRIMARY KEY,
  policy_key   TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  active       BOOLEAN NOT NULL DEFAULT true,
  features     JSONB,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline stages for job roles
CREATE TABLE IF NOT EXISTS pipelines (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  description  TEXT,
  ordinal      INT NOT NULL
);

-- Hiring requests (Kanban board)
CREATE TABLE IF NOT EXISTS hiring_requests (
  id           TEXT PRIMARY KEY,
  request_uid  TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  status       TEXT NOT NULL DEFAULT 'Pending Review',
  title        TEXT NOT NULL,
  description  TEXT,
  location     TEXT DEFAULT 'on-campus',
  requested_by TEXT NOT NULL,
  professor_id TEXT REFERENCES professors(id),
  hiring_manager_id TEXT REFERENCES hiring_managers(id),
  department   TEXT NOT NULL DEFAULT 'TBD',
  job_type     TEXT NOT NULL DEFAULT 'Full-time',
  positions    INT  NOT NULL DEFAULT 1,
  start_date   TEXT NOT NULL DEFAULT 'TBD',
  deadline     DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '90 days',
  pipeline_stage TEXT NOT NULL DEFAULT 'Request',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Active job openings
CREATE TABLE IF NOT EXISTS active_openings (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  tag          TEXT NOT NULL,
  department   TEXT NOT NULL,
  request_id   TEXT REFERENCES hiring_requests(id),
  role_uid     TEXT UNIQUE DEFAULT gen_random_uuid(),
  candidates   INT  NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'Applied'
                 CHECK (status IN ('Applied','Screening','Interview','Offer','HR Round')),
  deadline     TEXT NOT NULL,
  is_open      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks (dashboard to-do list)
CREATE TABLE IF NOT EXISTS tasks (
  id           SERIAL PRIMARY KEY,
  text         TEXT NOT NULL,
  priority     TEXT NOT NULL DEFAULT 'Medium'
                 CHECK (priority IN ('High','Medium','Low')),
  due_date     DATE,
  completed    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Agenda events
CREATE TABLE IF NOT EXISTS agenda_events (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  subtitle     TEXT,
  time_start   TEXT NOT NULL,
  time_end     TEXT NOT NULL,
  time_label   TEXT NOT NULL,
  top_px       INT  NOT NULL,
  height_px    INT  NOT NULL,
  variant      TEXT NOT NULL DEFAULT 'default'
                 CHECK (variant IN ('primary','default','dashed')),
  event_date   DATE NOT NULL
);

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
  id           SERIAL PRIMARY KEY,
  candidate_uid TEXT UNIQUE DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  role_applied TEXT NOT NULL,
  applied_date TEXT NOT NULL,
  ref_id       TEXT NOT NULL UNIQUE,
  email        TEXT NOT NULL,
  phone        TEXT,
  location     TEXT,
  current_location TEXT,
  linkedin_url TEXT,
  github_url   TEXT,
  resume_path  TEXT,
  cv_path      TEXT,
  status       TEXT NOT NULL DEFAULT 'Under Review',
  opening_id   TEXT REFERENCES active_openings(id),
  skills               JSONB,
  education_details    JSONB,
  academic_background   JSONB,
  qa_responses         JSONB,
  ai_summary           TEXT,
  ai_match             TEXT,
  resume_highlights    JSONB,
  additional_questions JSONB,
  professor_notes      TEXT,
  hr_notes             TEXT,
  interview_at         TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Applications (submitted by applicants via public form)
CREATE TABLE IF NOT EXISTS applications (
  id              SERIAL PRIMARY KEY,
  application_uid TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  opening_id      TEXT REFERENCES active_openings(id),
  request_id      TEXT REFERENCES hiring_requests(id),
  professor_id    TEXT REFERENCES professors(id),
  hiring_manager_id TEXT REFERENCES hiring_managers(id),
  candidate_uid   TEXT,
  source          TEXT,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  linkedin_url    TEXT,
  github_url      TEXT,
  cover_note      TEXT,
  resume_path     TEXT,
  cv_path         TEXT,
  token           TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  status          TEXT NOT NULL DEFAULT 'Applied'
                    CHECK (status IN ('Applied','Screening','Interview','Offer','Rejected')),
  education       JSONB,   -- [{college, degree, major, year}]
  submitted_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Rich candidate profiles with full application assets and interview history
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id                 SERIAL PRIMARY KEY,
  candidate_uid      TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  application_id     INT REFERENCES applications(id),
  hiring_request_id  TEXT REFERENCES hiring_requests(id),
  opening_id         TEXT REFERENCES active_openings(id),
  request_id         TEXT,
  name               TEXT NOT NULL,
  email              TEXT NOT NULL,
  phone              TEXT,
  current_location   TEXT,
  role_applied       TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'Applied',
  ref_id             TEXT UNIQUE,
  linkedin_url       TEXT,
  github_url         TEXT,
  resume_path        TEXT,
  cv_path            TEXT,
  cover_note         TEXT,
  academic_background JSONB,
  education_history  JSONB,
  skills             JSONB,
  additional_questions JSONB,
  ai_interview_summary TEXT,
  chatbot_transcript JSONB,
  hiring_manager_notes TEXT,
  professor_notes     TEXT,
  hr_notes            TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Admissions tracking per opening
CREATE TABLE IF NOT EXISTS admissions (
  id              SERIAL PRIMARY KEY,
  opening_id      TEXT REFERENCES active_openings(id),
  candidate_id    INT REFERENCES candidates(id),
  candidate_profile_id INT REFERENCES candidate_profiles(id),
  stage           TEXT NOT NULL DEFAULT 'Applied'
                    CHECK (stage IN ('Applied','Screening','HR Round','Final','Offer','Rejected')),
  score           INT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- JD Reviews
CREATE TABLE IF NOT EXISTS jd_reviews (
  id           SERIAL PRIMARY KEY,
  opening_id   TEXT REFERENCES active_openings(id),
  feedback     TEXT,
  flags        JSONB,
  reviewer_name TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
  id           SERIAL PRIMARY KEY,
  candidate_id INT REFERENCES candidates(id),
  candidate_profile_id INT REFERENCES candidate_profiles(id),
  transcript   JSONB,
  ai_scores    JSONB,
  ai_overall   DECIMAL(3,1),
  manual_scores JSONB,
  manual_overall DECIMAL(3,1),
  composite_score DECIMAL(3,1),
  status       TEXT,
  round_type   TEXT,
  reviewer_id  TEXT,
  conducted_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-level job roles / positions
CREATE TABLE IF NOT EXISTS job_roles (
  id               TEXT PRIMARY KEY,
  request_id       TEXT REFERENCES hiring_requests(id),
  opening_id       TEXT REFERENCES active_openings(id),
  title            TEXT NOT NULL,
  description      TEXT,
  department       TEXT REFERENCES departments(id),
  professor_id     TEXT REFERENCES professors(id),
  hiring_manager_id TEXT REFERENCES hiring_managers(id),
  stage            TEXT NOT NULL DEFAULT 'Request',
  status           TEXT NOT NULL DEFAULT 'Draft',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Job description drafts and review history
CREATE TABLE IF NOT EXISTS job_descriptions (
  id             SERIAL PRIMARY KEY,
  role_id        TEXT REFERENCES job_roles(id),
  request_id     TEXT REFERENCES hiring_requests(id),
  opening_id     TEXT REFERENCES active_openings(id),
  author_type    TEXT NOT NULL CHECK (author_type IN ('Professor','Hiring Manager','Hiring Assistant','CHRO','System')),
  author_id      TEXT,
  version        INT NOT NULL DEFAULT 1,
  content        TEXT,
  comments       JSONB,
  status         TEXT NOT NULL DEFAULT 'Draft',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Rich candidate profiles with full application assets and interview history
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id                 SERIAL PRIMARY KEY,
  candidate_uid      TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  application_id     INT REFERENCES applications(id),
  hiring_request_id  TEXT REFERENCES hiring_requests(id),
  opening_id         TEXT REFERENCES active_openings(id),
  request_id         TEXT,
  name               TEXT NOT NULL,
  email              TEXT NOT NULL,
  phone              TEXT,
  current_location   TEXT,
  role_applied       TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'Applied',
  ref_id             TEXT UNIQUE,
  linkedin_url       TEXT,
  github_url         TEXT,
  resume_path        TEXT,
  cv_path            TEXT,
  cover_note         TEXT,
  academic_background JSONB,
  education_history  JSONB,
  skills             JSONB,
  additional_questions JSONB,
  ai_interview_summary TEXT,
  chatbot_transcript JSONB,
  hiring_manager_notes TEXT,
  professor_notes     TEXT,
  hr_notes            TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate round records to reflect screening, professor interview, and HR interview steps
CREATE TABLE IF NOT EXISTS candidate_rounds (
  id                 SERIAL PRIMARY KEY,
  candidate_id       INT REFERENCES candidate_profiles(id),
  round_type         TEXT NOT NULL CHECK (round_type IN ('Primary Screening','Professor Interview','HR Interview','Offer','Onboarding')),
  round_name         TEXT,
  status             TEXT NOT NULL DEFAULT 'Pending',
  decision           TEXT,
  decision_notes     TEXT,
  round_data         JSONB,
  conducted_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Document and profile assets for each candidate
CREATE TABLE IF NOT EXISTS candidate_assets (
  id                 SERIAL PRIMARY KEY,
  candidate_id       INT REFERENCES candidate_profiles(id),
  asset_type         TEXT NOT NULL CHECK (asset_type IN ('Resume','CV','LinkedIn','GitHub','Portfolio','Transcript','Other')),
  url                TEXT,
  caption            TEXT,
  uploaded_at        TIMESTAMPTZ DEFAULT NOW()
);

-- KPI stats cache
CREATE TABLE IF NOT EXISTS kpi_stats (
  key        TEXT PRIMARY KEY,
  value      INT  NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO kpi_stats (key, value) VALUES
  ('unopened_apps', 342), ('jd_requests', 18), ('approvals', 12)
ON CONFLICT (key) DO NOTHING;

-- Departments seed
INSERT INTO departments VALUES
  ('CS-01','Computer Science'),('DS-02','Data Science'),
  ('LA-03','Liberal Arts'),('ME-04','Mechanical Engineering'),
  ('PH-05','Physics'),('MA-06','Mathematics'),
  ('EC-07','Social Sciences'),('GA-08','General Administration')
ON CONFLICT DO NOTHING;
