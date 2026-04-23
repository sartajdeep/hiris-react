# HIRIS Platform Features

HIRIS (Hiring and Recruitment Information System) is an intelligent, multi-portal B2B platform designed to streamline academic and professional recruitment.

## Platform Architecture
The platform is broken down into three primary portals, each tailored to a specific organisational persona, managed by a central CHRO dashboard.

### 1. CHRO Portal (The Control Center)
The CHRO portal provides a top-down view of the entire organisation's hiring pipelines, policies, and final-stage candidate approvals.
- **Organisation Dashboard**: View live statistics on open positions, active applicants, and departmental pipeline health.
- **Candidate Aggregation**: See a unified list of all candidates who have made it to the final HR round across all departments.
- **Hiring Policy Management**: Upload and manage institutional rubrics, policies, and scoring criteria.
- **Manager Assignment**: Delegate hiring responsibilities and job roles to specific professors or department heads.
- **Final Approvals**: Review AI scores and Hiring Manager verdicts to make the final "Hire" or "Reject" decision.

### 2. Hiring Assistant Portal (The Operational Hub)
Designed for HR personnel to manage the day-to-day operations of recruitment.
- **Task & Agenda Management**: Track daily tasks and view upcoming interviews on a timeline.
- **Job Request Processing**: Receive requests from Professors to open new roles and convert them into polished Job Descriptions (JDs).
- **Application Builder**: Build custom application forms for candidates.
- **Candidate Pipeline**: Move candidates through different stages (Applied, Screening, Interviewing, Offered).
- **AI Resume Screening**: Automatically parse uploaded resumes to score candidates based on the JD requirements.

### 3. Professor / Hiring Manager Portal (The Evaluation Hub)
Designed for department leaders who need to evaluate candidates without getting bogged down in HR logistics.
- **Job Requisition**: Request new roles for their department.
- **JD Review**: Review and approve the Job Descriptions created by the Hiring Assistant.
- **Candidate Shortlisting**: View the curated list of candidates that passed the initial HR screening.
- **Interview Room**: A dedicated interface for conducting interviews, featuring:
  - Live AI-generated transcriptions.
  - Real-time scoring suggestions based on the institutional rubric.
  - Three-column evaluation view (Candidate Info, Live Feed, Rubric Scoring).

### 4. Candidate Portal (The Application Flow)
The public-facing application interface for job seekers.
- **AI Copilot Application**: Instead of filling out rigid forms, candidates interact with an AI chatbot that collects their information conversationally.
- **Document Upload**: Seamlessly upload CVs, cover letters, and portfolios.
- **Status Tracking**: Candidates can view the real-time status of their application.

## Core Platform Features
- **Persistent Dark Mode**: A unified, aesthetically pleasing dark mode toggle accessible across all portals.
- **Unified Authentication**: Single Sign-On (SSO) structure allowing users to jump between portals if they have the appropriate roles.
- **Organisational Onboarding**: A 4-step wizard for setting up new organisations, defining roles, and inviting team members.
- **Data Isolation**: Multi-tenant architecture ensuring candidates and data are restricted to their specific organisation and department.
