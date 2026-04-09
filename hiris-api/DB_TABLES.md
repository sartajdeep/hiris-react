# HIRIS PostgreSQL Table Reference

This document lists all PostgreSQL tables defined in `hiris-api/db/schema.sql`, with each table's columns and purpose.

---

## departments
Lookup table for academic or administrative departments.

```sql
Table: departments
+------------+--------+-------------------------------------------+
| Column     | Type   | Notes                                     |
+------------+--------+-------------------------------------------+
| id         | TEXT   | Primary key (e.g. CS-01)                  |
| name       | TEXT   | Department name                           |
+------------+--------+-------------------------------------------+
```

---

## professors
Stores professor records who request hires and review JDs/interviews.

```sql
Table: professors
+----------------+-------------+-------------------------------------------+
| Column         | Type        | Notes                                     |
+----------------+-------------+-------------------------------------------+
| id             | TEXT        | Primary key                               |
| name           | TEXT        | Professor name                            |
| email          | TEXT        | Unique professor email                    |
| title          | TEXT        | Job title                                 |
| department     | TEXT        | References departments(id)                |
| phone          | TEXT        | Contact phone                             |
| linkedin_url   | TEXT        | LinkedIn URL                              |
| github_url     | TEXT        | GitHub URL                                |
| profile_notes  | TEXT        | Notes about the professor                 |
| created_at     | TIMESTAMPTZ | Record creation timestamp                 |
+----------------+-------------+-------------------------------------------+
```

---

## hiring_managers
Stores hiring manager and HR reviewer records.

```sql
Table: hiring_managers
+-------------+-------------+-------------------------------------------+
| Column      | Type        | Notes                                     |
+-------------+-------------+-------------------------------------------+
| id          | TEXT        | Primary key                               |
| name        | TEXT        | Hiring manager name                       |
| email       | TEXT        | Unique email                              |
| title       | TEXT        | Job title                                 |
| department  | TEXT        | References departments(id)                |
| phone       | TEXT        | Contact phone                             |
| created_at  | TIMESTAMPTZ | Creation timestamp                        |
+-------------+-------------+-------------------------------------------+
```

---

## hiring_policies
Contains configured hiring policies, feature flags, and policy details.

```sql
Table: hiring_policies
+-------------+-------------+-------------------------------------------+
| Column      | Type        | Notes                                     |
+-------------+-------------+-------------------------------------------+
| id          | SERIAL      | Primary key                               |
| policy_key  | TEXT        | Unique policy identifier                  |
| title       | TEXT        | Policy title                              |
| description | TEXT        | Policy description                        |
| active      | BOOLEAN     | Policy active state                       |
| features    | JSONB       | Feature list/details                      |
| created_at  | TIMESTAMPTZ | Creation timestamp                        |
+-------------+-------------+-------------------------------------------+
```

---

## pipelines
Defines pipeline stages used across hiring workflows.

```sql
Table: pipelines
+-------------+---------+-------------------------------------------+
| Column      | Type    | Notes                                     |
+-------------+---------+-------------------------------------------+
| id          | SERIAL  | Primary key                               |
| name        | TEXT    | Unique stage name                         |
| description | TEXT    | Stage description                         |
| ordinal     | INT     | Stage order                               |
+-------------+---------+-------------------------------------------+
```

---

## hiring_requests
Kanban-style hiring request tracker from professor through approval.

```sql
Table: hiring_requests
+---------------------+-------------+-------------------------------------------+
| Column              | Type        | Notes                                     |
+---------------------+-------------+-------------------------------------------+
| id                  | TEXT        | Primary key                               |
| request_uid         | TEXT        | Unique UUID for the request               |
| status              | TEXT        | Request status                            |
| title               | TEXT        | Request title                             |
| description         | TEXT        | Request description                       |
| location            | TEXT        | Job location                              |
| requested_by        | TEXT        | Originating user                          |
| professor_id        | TEXT        | References professors(id)                 |
| hiring_manager_id   | TEXT        | References hiring_managers(id)            |
| department          | TEXT        | Department name                           |
| job_type            | TEXT        | Job type                                  |
| positions           | INT         | Number of openings                        |
| start_date          | TEXT        | Start date                                |
| deadline            | DATE        | Application deadline                      |
| pipeline_stage      | TEXT        | Workflow stage                            |
| created_at          | TIMESTAMPTZ | Creation timestamp                        |
+---------------------+-------------+-------------------------------------------+
```

---

## active_openings
Tracks active job postings and associated opening details.

```sql
Table: active_openings
+-------------+-------------+-------------------------------------------+
| Column      | Type        | Notes                                     |
+-------------+-------------+-------------------------------------------+
| id          | TEXT        | Primary key                               |
| title       | TEXT        | Opening title                             |
| tag         | TEXT        | Job tag/category                          |
| department  | TEXT        | Department name                           |
| request_id  | TEXT        | References hiring_requests(id)            |
| role_uid    | TEXT        | Unique role identifier                    |
| candidates  | INT         | Count of candidates                       |
| status      | TEXT        | Opening status                            |
| deadline    | TEXT        | Deadline label/text                       |
| is_open     | BOOLEAN     | Open/closed flag                          |
| created_at  | TIMESTAMPTZ | Creation timestamp                        |
+-------------+-------------+-------------------------------------------+
```

---

## tasks
Tracks dashboard to-dos and hiring assistant tasks.

```sql
Table: tasks
+------------+-------------+-------------------------------------------+
| Column     | Type        | Notes                                     |
+------------+-------------+-------------------------------------------+
| id         | SERIAL      | Primary key                               |
| text       | TEXT        | Task description                          |
| priority   | TEXT        | High / Medium / Low                       |
| due_date   | DATE        | Due date                                  |
| completed  | BOOLEAN     | Completion flag                           |
| created_at | TIMESTAMPTZ | Creation timestamp                        |
+------------+-------------+-------------------------------------------+
```

---

## agenda_events
Stores scheduled agenda cards for dashboard timeline.

```sql
Table: agenda_events
+--------------+-------------+-------------------------------------------+
| Column       | Type        | Notes                                     |
+--------------+-------------+-------------------------------------------+
| id           | SERIAL      | Primary key                               |
| title        | TEXT        | Event title                               |
| subtitle     | TEXT        | Event subtitle                            |
| time_start   | TEXT        | Start time                                |
| time_end     | TEXT        | End time                                  |
| time_label   | TEXT        | Display label                             |
| top_px       | INT         | UI top position                           |
| height_px    | INT         | UI height                                 |
| variant      | TEXT        | Visual variant                            |
| event_date   | DATE        | Event date                                |
+--------------+-------------+-------------------------------------------+
```

---

## candidates
Stores candidate metadata for the hiring cycle.

```sql
Table: candidates
+----------------------+-------------+-------------------------------------------+
| Column               | Type        | Notes                                     |
+----------------------+-------------+-------------------------------------------+
| id                   | SERIAL      | Primary key                               |
| candidate_uid        | TEXT        | Unique candidate UUID                     |
| name                 | TEXT        | Candidate name                            |
| role_applied         | TEXT        | Applied role                              |
| applied_date         | TEXT        | Application date                          |
| ref_id               | TEXT        | Unique reference ID                       |
| email                | TEXT        | Candidate email                           |
| phone                | TEXT        | Candidate phone                           |
| location             | TEXT        | Candidate location                        |
| current_location     | TEXT        | Current location                          |
| linkedin_url         | TEXT        | LinkedIn profile                          |
| github_url           | TEXT        | GitHub profile                            |
| resume_path          | TEXT        | Resume file path                          |
| cv_path              | TEXT        | CV file path                              |
| status               | TEXT        | Candidate status                          |
| opening_id           | TEXT        | References active_openings(id)            |
| skills               | JSONB       | Skill metadata                            |
| education_details    | JSONB       | Education details                         |
| academic_background  | JSONB       | Academic background                       |
| qa_responses         | JSONB       | QA responses                              |
| ai_summary           | TEXT        | AI interview summary                      |
| ai_match             | TEXT        | AI match label                            |
| resume_highlights    | JSONB       | Resume highlights                         |
| additional_questions | JSONB       | Additional resume questions               |
| professor_notes      | TEXT        | Professor notes                           |
| hr_notes             | TEXT        | HR notes                                  |
| interview_at         | TIMESTAMPTZ | Interview timestamp                       |
| created_at           | TIMESTAMPTZ | Creation timestamp                        |
+----------------------+-------------+-------------------------------------------+
```

---

## applications
Public applicant submissions and application data.

```sql
Table: applications
+------------------+-------------+-------------------------------------------+
| Column           | Type        | Notes                                     |
+------------------+-------------+-------------------------------------------+
| id               | SERIAL      | Primary key                               |
| application_uid  | TEXT        | Unique application UUID                   |
| opening_id       | TEXT        | References active_openings(id)            |
| request_id       | TEXT        | References hiring_requests(id)            |
| professor_id     | TEXT        | References professors(id)                 |
| hiring_manager_id| TEXT        | References hiring_managers(id)            |
| candidate_uid    | TEXT        | Candidate UUID                            |
| source           | TEXT        | Source channel                            |
| full_name        | TEXT        | Applicant name                            |
| email            | TEXT        | Applicant email                           |
| phone            | TEXT        | Applicant phone                           |
| linkedin_url     | TEXT        | LinkedIn URL                              |
| github_url       | TEXT        | GitHub URL                                |
| cover_note       | TEXT        | Cover note                                |
| resume_path      | TEXT        | Resume file path                          |
| cv_path          | TEXT        | CV file path                              |
| token            | TEXT        | Applicant token                           |
| status           | TEXT        | Application status                        |
| education        | JSONB       | Education JSON data                       |
| submitted_at     | TIMESTAMPTZ | Submission timestamp                      |
+------------------+-------------+-------------------------------------------+
```

---

## candidate_profiles
Rich candidate profile records with full hiring data.

```sql
Table: candidate_profiles
+----------------------+-------------+-------------------------------------------+
| Column               | Type        | Notes                                     |
+----------------------+-------------+-------------------------------------------+
| id                   | SERIAL      | Primary key                               |
| candidate_uid        | TEXT        | Unique candidate UUID                     |
| application_id       | INT         | References applications(id)               |
| hiring_request_id    | TEXT        | References hiring_requests(id)            |
| opening_id           | TEXT        | References active_openings(id)            |
| request_id           | TEXT        | Request reference                          |
| name                 | TEXT        | Candidate name                            |
| email                | TEXT        | Candidate email                           |
| phone                | TEXT        | Candidate phone                           |
| current_location     | TEXT        | Current location                          |
| role_applied         | TEXT        | Role applied for                          |
| status               | TEXT        | Current status                            |
| ref_id               | TEXT        | Reference ID                              |
| linkedin_url         | TEXT        | LinkedIn URL                              |
| github_url           | TEXT        | GitHub URL                                |
| resume_path          | TEXT        | Resume path                               |
| cv_path              | TEXT        | CV path                                   |
| cover_note           | TEXT        | Cover note                                |
| academic_background  | JSONB       | Academic background data                  |
| education_history    | JSONB       | Education history                         |
| skills               | JSONB       | Skills data                               |
| additional_questions | JSONB       | Additional question responses             |
| ai_interview_summary | TEXT        | AI interview summary                      |
| chatbot_transcript   | JSONB       | Chatbot transcript                        |
| hiring_manager_notes | TEXT        | Hiring manager notes                      |
| professor_notes      | TEXT        | Professor notes                           |
| hr_notes             | TEXT        | HR notes                                  |
| created_at           | TIMESTAMPTZ | Creation timestamp                        |
| updated_at           | TIMESTAMPTZ | Update timestamp                          |
+----------------------+-------------+-------------------------------------------+
```

---

## admissions
Tracking applicant progress through admissions and screening.

```sql
Table: admissions
+--------------------+-------------+-------------------------------------------+
| Column             | Type        | Notes                                     |
+--------------------+-------------+-------------------------------------------+
| id                 | SERIAL      | Primary key                               |
| opening_id         | TEXT        | References active_openings(id)            |
| candidate_id       | INT         | References candidates(id)                 |
| candidate_profile_id| INT        | References candidate_profiles(id)         |
| stage              | TEXT        | Admissions stage                          |
| score              | INT         | Score or rating                           |
| notes              | TEXT        | Notes                                     |
| created_at         | TIMESTAMPTZ | Creation timestamp                        |
+--------------------+-------------+-------------------------------------------+
```

---

## jd_reviews
Job description review and feedback history.

```sql
Table: jd_reviews
+----------------+-------------+-------------------------------------------+
| Column         | Type        | Notes                                     |
+----------------+-------------+-------------------------------------------+
| id             | SERIAL      | Primary key                               |
| opening_id      | TEXT        | References active_openings(id)            |
| feedback       | TEXT        | Reviewer feedback                         |
| flags          | JSONB       | Review flags                              |
| reviewer_name  | TEXT        | Reviewer name                             |
| submitted_at   | TIMESTAMPTZ | Submission timestamp                      |
+----------------+-------------+-------------------------------------------+
```

---

## interview_sessions
Interview session records for professor and CHRO rounds.

```sql
Table: interview_sessions
+-----------------------+----------------+-------------------------------------------+
| Column                | Type           | Notes                                     |
+-----------------------+----------------+-------------------------------------------+
| id                    | SERIAL         | Primary key                               |
| candidate_id          | INT            | References candidates(id)                 |
| candidate_profile_id  | INT            | References candidate_profiles(id)         |
| transcript            | JSONB          | Interview transcript data                 |
| ai_scores             | JSONB          | AI score breakdown                        |
| ai_overall            | DECIMAL(3,1)   | AI overall score                          |
| manual_scores         | JSONB          | Manual scoring breakdown                  |
| manual_overall        | DECIMAL(3,1)   | Manual overall score                      |
| composite_score       | DECIMAL(3,1)   | Composite score                           |
| status                | TEXT           | Interview status                          |
| round_type            | TEXT           | Interview round type                      |
| reviewer_id           | TEXT           | Reviewer ID                               |
| conducted_at          | TIMESTAMPTZ   | Conducted timestamp                        |
+-----------------------+----------------+-------------------------------------------+
```

---

## job_roles
Represents the role and its connection to a request, opening, and stakeholders.

```sql
Table: job_roles
+----------------------+-------------+-------------------------------------------+
| Column               | Type        | Notes                                     |
+----------------------+-------------+-------------------------------------------+
| id                   | TEXT        | Primary key                               |
| request_id           | TEXT        | References hiring_requests(id)            |
| opening_id           | TEXT        | References active_openings(id)            |
| title                | TEXT        | Role title                                |
| description          | TEXT        | Role description                          |
| department           | TEXT        | References departments(id)                |
| professor_id         | TEXT        | References professors(id)                 |
| hiring_manager_id    | TEXT        | References hiring_managers(id)            |
| stage                | TEXT        | Workflow stage                            |
| status               | TEXT        | Role status                               |
| created_at           | TIMESTAMPTZ | Creation timestamp                        |
+----------------------+-------------+-------------------------------------------+
```

---

## job_descriptions
Drafts and review history for job descriptions.

```sql
Table: job_descriptions
+----------------+-------------+-------------------------------------------+
| Column         | Type        | Notes                                     |
+----------------+-------------+-------------------------------------------+
| id             | SERIAL      | Primary key                               |
| role_id        | TEXT        | References job_roles(id)                  |
| request_id     | TEXT        | References hiring_requests(id)            |
| opening_id     | TEXT        | References active_openings(id)            |
| author_type    | TEXT        | Author type                               |
| author_id      | TEXT        | Author identifier                          |
| version        | INT         | Draft version                             |
| content        | TEXT        | JD content                                |
| comments       | JSONB       | Reviewer comments                          |
| status         | TEXT        | Draft status                               |
| created_at     | TIMESTAMPTZ | Creation timestamp                        |
| updated_at     | TIMESTAMPTZ | Update timestamp                          |
+----------------+-------------+-------------------------------------------+
```

---

## candidate_rounds
Logs each round for every candidate in the pipeline.

```sql
Table: candidate_rounds
+----------------+-------------+-------------------------------------------+
| Column         | Type        | Notes                                     |
+----------------+-------------+-------------------------------------------+
| id             | SERIAL      | Primary key                               |
| candidate_id   | INT         | References candidate_profiles(id)         |
| round_type     | TEXT        | Round type                                |
| round_name     | TEXT        | Round name                                |
| status         | TEXT        | Round status                              |
| decision       | TEXT        | Proceed/reject/hold                       |
| decision_notes | TEXT        | Decision notes                            |
| round_data     | JSONB       | Round-specific data                       |
| conducted_at   | TIMESTAMPTZ | Conducted timestamp                       |
| created_at     | TIMESTAMPTZ | Creation timestamp                        |
+----------------+-------------+-------------------------------------------+
```

---

## candidate_assets
Stores resume/CV/LinkedIn/GitHub/profile asset links.

```sql
Table: candidate_assets
+----------------+-------------+-------------------------------------------+
| Column         | Type        | Notes                                     |
+----------------+-------------+-------------------------------------------+
| id             | SERIAL      | Primary key                               |
| candidate_id   | INT         | References candidate_profiles(id)         |
| asset_type     | TEXT        | Asset type                                |
| url            | TEXT        | Asset URL                                 |
| caption        | TEXT        | Asset caption                             |
| uploaded_at    | TIMESTAMPTZ | Upload timestamp                          |
+----------------+-------------+-------------------------------------------+
```

---

## kpi_stats
Simple KPI cache table.

```sql
Table: kpi_stats
+-------------+-------------+-------------------------------------------+
| Column      | Type        | Notes                                     |
+-------------+-------------+-------------------------------------------+
| key         | TEXT        | Primary key                               |
| value       | INT         | KPI numeric value                         |
| updated_at  | TIMESTAMPTZ | Update timestamp                          |
+-------------+-------------+-------------------------------------------+
```
