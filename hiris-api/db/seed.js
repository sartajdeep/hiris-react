require('dotenv').config()
const db = require('./pool')

async function seed() {

  // ── Professors and hiring managers ────────────────────────────────────────
  const professors = [
    ['PROF-001','Dr. Julian Sterling','julian.sterling@university.edu','Professor of Biology','CS-01','+1 (650) 555-0101','https://linkedin.com/in/julian-sterling','https://github.com/julian-sterling','Requests computational biology and lab hires.'],
    ['PROF-002','Prof. Arpan Kar','arpan.kar@example.edu','Professor of AI','DS-02','+91 98765 43210','https://linkedin.com/in/arpan-kar','https://github.com/arpankar','Leads AI research and faculty hiring for ML roles.'],
    ['PROF-003','Prof. Nandini Das','nandini.das@example.edu','Professor of Liberal Arts','LA-03','+91 98765 00123','https://linkedin.com/in/nandini-das','https://github.com/nandini-das','Supervises writing center and humanities support roles.'],
    ['PROF-004','Dr. Ramesh Iyer','ramesh.iyer@example.edu','Professor of Physics','PH-05','+91 98456 11223','https://linkedin.com/in/ramesh-iyer','https://github.com/ramesh-iyer','Seeks technical laboratory and instrumentation support hires.'],
    ['PROF-005','Dr. Priya Menon','priya.menon@example.edu','Professor of Data Science','DS-02','+91 98200 33445','https://linkedin.com/in/priya-menon','https://github.com/priyamenon','Leads data science research appointments.'],
    ['PROF-006','Dr. Sunita Sharma','sunita.sharma@example.edu','Professor of Mathematics','MA-06','+91 98300 11234','https://linkedin.com/in/sunita-sharma','https://github.com/sunitasharma','Oversees adjunct and faculty associates.'],
    ['PROF-007','Prof. Vikram Nair','vikram.nair@example.edu','Professor of Computer Science','CS-01','+1 (415) 555-0188','https://linkedin.com/in/vikram-nair','https://github.com/vikram-nair','Heads systems engineering and platform roles.'],
    ['PROF-008','Prof. Anika Singh','anika.singh@example.edu','Professor of Design','EC-07','+44 7700 123456','https://linkedin.com/in/anika-singh','https://github.com/anikasingh','Manages design and UX hiring requests.'],
  ]
  for (const p of professors) {
    await db.query(
      `INSERT INTO professors (id,name,email,title,department,phone,linkedin_url,github_url,profile_notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING`, p
    )
  }

  const hiringManagers = [
    ['HM-001','Smriti Kinra','smriti.kinra@hiris.com','HR Lead','GA-08','+91 98100 11222'],
    ['HM-002','Naveen Rao','naveen.rao@hiris.com','Head of Marketing','EC-07','+91 98100 33445'],
  ]
  for (const m of hiringManagers) {
    await db.query(
      `INSERT INTO hiring_managers (id,name,email,title,department,phone)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`, m
    )
  }

  // ── Hiring requests ───────────────────────────────────────────────────────
  const requests = [
    // Professor Julian Sterling's own requests (appear in the Professor portal sidebar)
    ['REQ-PROF-001','Pending Review','Graduate Research Assistant – Computational Biology','Dr. Julian Sterling','Dept of Biology','Full-time',1,'Sept 1, 2026','2026-08-15','PROF-001',null],
    ['REQ-PROF-002','Sent for Approval','Postdoctoral Fellow – Neuroscience Lab','Dr. Julian Sterling','Dept of Neuroscience','Full-time',1,'Aug 1, 2026','2026-07-15','PROF-001',null],
    ['REQ-PROF-003','Approved','Lab Technician III – Genetics','Dr. Julian Sterling','Genetics Lab','Full-time',2,'Jul 1, 2026','2026-06-15','PROF-001',null],
    // Other department requests (visible in Hiring Assistant's board)
    ['REQ-2642','Pending Review','Computer Science – AI Research Assistant','Prof. Arpan Kar','Dept of Computer Science','Full-time',2,'Sept 1, 2026','2026-08-15','PROF-002',null],
    ['REQ-2646','Pending Review','Liberal Arts – Writing Center Tutor','Prof. Nandini Das','Humanities','Part-time',2,'Sept 1, 2026','2026-08-15','PROF-003',null],
    ['REQ-2651','Pending Review','Physics – Lab Technician','Dr. Ramesh Iyer','Dept of Physics','Full-time',1,'Oct 1, 2026','2026-09-01','PROF-004',null],
    ['REQ-2645','Sent for Approval','Mechanical Engineering – Workshop Instructor','Office of Registrar','General Admin','Internship',2,'Sept 1, 2026','2026-08-15',null,'HM-001'],
    ['REQ-2648','Sent for Approval','Data Science – Research Associate','Dr. Priya Menon','Dept of Data Science','Full-time',3,'Aug 15, 2026','2026-07-31','PROF-005',null],
    ['REQ-2638','Approved','Mathematics – Faculty Associate','Dr. Sunita Sharma','Dept of Data Science','Part-time',2,'Sept 1, 2026','2026-08-15','PROF-006',null],
    ['REQ-2639','Approved','Computer Science – Systems Engineer','Prof. Vikram Nair','Dept of Computer Science','Full-time',1,'Jul 1, 2026','2026-06-15','PROF-007',null],
    ['REQ-2655','Sent for Approval','Design – UI/UX Designer','Prof. Anika Singh','Design','Full-time',1,'Oct 1, 2026','2026-09-01','PROF-008',null],
    ['REQ-2658','Pending Review','Marketing – Content Strategist','Head of Marketing','Marketing & Comms','Part-time',1,'Nov 1, 2026','2026-10-15',null,'HM-002'],
  ]
  for (const r of requests) {
    await db.query(
      `INSERT INTO hiring_requests (id,status,title,requested_by,department,job_type,positions,start_date,deadline,professor_id,hiring_manager_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT DO NOTHING`, r
    )
  }

  // ── Active openings ───────────────────────────────────────────────────────
  const openings = [
    ['CS-2026-001','Full Stack Developer','Full-time','Computer Science',12,'Interview','Aug 15, 2026',null],
    ['DS-2026-007','Data Science Researcher','Full-time','Data Science',8,'Screening','Sept 1, 2026',null],
    ['ME-2026-003','Workshop Instructor','Internship','Mechanical Eng.',5,'Applied','Oct 15, 2026',null],
    ['LA-2026-004','Writing Center Tutor','Part-time','Liberal Arts',19,'Interview','Aug 30, 2026',null],
    ['PH-2026-005','Physics Lab Technician','Full-time','Physics',3,'Applied','Sept 30, 2026',null],
    ['CS-2026-009','AI Ethics Researcher','Full-time','Computer Science',22,'Offer','Jul 20, 2026',null],
    ['GA-2026-001','Admissions Officer','Full-time','General Admin',9,'HR Round','Jul 30, 2026',null],
    ['MA-2026-006','Mathematics Faculty Associate','Part-time','Mathematics',11,'Interview','Aug 15, 2026',null],
    ['DE-2026-010','Senior Product Designer','Full-time','Design',42,'Screening','Oct 1, 2026',null],
    ['HR-2026-002','HR Business Partner','Contract','Human Resources',15,'Applied','Sep 10, 2026',null],
    // Professor Sterling's openings
    ['BIO-2026-001','Graduate Research Assistant – Computational Biology','Full-time','Biology',6,'Interview','Aug 15, 2026','REQ-PROF-001'],
    ['NEU-2026-002','Postdoctoral Fellow – Neuroscience Lab','Full-time','Neuroscience',4,'Interview','Aug 1, 2026','REQ-PROF-002'],
    ['GEN-2026-003','Lab Technician III – Genetics','Full-time','Genetics Lab',8,'Offer','Jul 1, 2026','REQ-PROF-003'],
  ]
  for (const o of openings) {
    await db.query(
      `INSERT INTO active_openings (id,title,tag,department,candidates,status,deadline,request_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`, o
    )
  }

  // ── Pipeline stages & hiring policy definitions ─────────────────────────────
  const pipelines = [
    ['Request','Initial hire request created by professor or department',1],
    ['JD Draft','Hiring assistant drafts the job description',2],
    ['Approval','Professor reviews draft and suggests changes',3],
    ['Posting','Job is published to active openings',4],
    ['Screening','Initial screening by the hiring assistant',5],
    ['Professor Interview','Professor conducts technical interview',6],
    ['HR Interview','CHRO/hiring manager conducts HR interview',7],
    ['Offer','Offer is prepared and sent',8],
  ]
  for (const p of pipelines) {
    await db.query('INSERT INTO pipelines (name,description,ordinal) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING', p)
  }

  const hiringPolicies = [
    ['salary-approval','Salary approval policy','All new hires above mid-level require HR + finance signoff.',true, JSON.stringify(['salary cap','approval chain'])],
    ['interview-feedback','Interview feedback policy','Collect structured professor feedback for each interview round.',true, JSON.stringify(['professor review','scorecards','notes archive'])],
    ['resume-retention','Resume retention policy','Store candidate resumes and transcripts for 24 months unless privacy removal requested.',true, JSON.stringify(['retention period','data access','deletion request'])],
  ]
  for (const policy of hiringPolicies) {
    await db.query(
      'INSERT INTO hiring_policies (policy_key,title,description,active,features) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING', policy)
  }

  // ── Tasks ─────────────────────────────────────────────────────────────────
  const tasks = [
    ['Review Data Science shortlist','High',null],
    ['Approve internship request','Medium',null],
    ['Send offer letter — Dr. Ananya Roy','High','2026-03-20'],
    ['Schedule panel interviews — Robotics role','Medium','2026-03-25'],
    ['Update JD — Writing Center Tutor','Low','2026-03-28'],
    ['Confirm background check — Dr. Mehta','High','2026-03-21'],
    ['Draft rejection template for DS role','Medium',null],
    ['Coordinate travel for onsite interviews','High','2026-04-01'],
  ]
  for (const t of tasks) {
    await db.query('INSERT INTO tasks (text,priority,due_date) VALUES ($1,$2,$3)', t)
  }

  // ── Agenda events ─────────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0]
  const events = [
    ['Faculty Interview','Dr. Ananya Roy','09:15','10:15','09:15-10:15',21,84,'primary'],
    ['Team Standup','Sync on active pipeline','10:30','11:30','10:30-11:30',126,84,'default'],
    ['Candidate Screening','Reviewing resumes','13:00','14:00','13:00-14:00',336,84,'default'],
    ['Hiring Pipeline Sync','All Dept Heads - HR','14:15','15:15','14:15-15:15',441,84,'default'],
    ['Focus Time',null,'16:00','16:45','16:00-16:45',588,63,'dashed'],
    ['Wrap-Up - Notes','Summarize outcomes','17:15','17:45','17:15-17:45',693,42,'default'],
    ['Evening HR Catchup','Daily brief with HR VP','18:00','18:30','18:00-18:30',756,42,'default'],
  ]
  for (const e of events) {
    await db.query(
      `INSERT INTO agenda_events (title,subtitle,time_start,time_end,time_label,top_px,height_px,variant,event_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [...e, today]
    )
  }

  // ── General candidate pool ────────────────────────────────────────────────
  const candidates = [
    ['James Anderson','Admissions Officer','Oct 12, 2023','#ADM-2023-042','james.anderson@example.com','+1 (555) 012-3456','San Francisco, CA','HR Round','GA-2026-001'],
    ['Priya Sharma','AI Ethics Researcher','Jan 5, 2026','#CS-2026-009A','priya.sharma@example.com','+91 98765 43210','Bangalore, India','Final Round','CS-2026-009'],
    ['David Chen','Full Stack Developer','Feb 14, 2026','#CS-2026-001A','david.chen@example.com','+1 (555) 987-6543','New York, NY','Offer','CS-2026-001'],
    ['Ayesha Khan','Data Science Researcher','Mar 1, 2026','#DS-2026-007A','ayesha.khan@example.com','+44 7700 900123','London, UK','Interview','DS-2026-007'],
    ['Elena Rostova','Workshop Instructor','Mar 15, 2026','#ME-2026-003A','elena.r@example.com','+1 (415) 555-0909','Seattle, WA','Applied','ME-2026-003'],
    ['Carlos Gomez','Writing Center Tutor','Mar 18, 2026','#LA-2026-004A','carlos.g@example.com','+1 (212) 555-1234','Chicago, IL','Interview','LA-2026-004'],
    ['Wei Zhang','Physics Lab Technician','Mar 20, 2026','#PH-2026-005A','wei.zhang@example.com','+86 10 1234 5678','Beijing, China','Applied','PH-2026-005'],
    ['Sarah Johnson','Mathematics Faculty Associate','Apr 2, 2026','#MA-2026-006A','s.johnson@example.com','+1 (303) 555-9876','Denver, CO','Interview','MA-2026-006'],
    ['Nina Patel','Senior Product Designer','Apr 5, 2026','#DE-2026-010A','n.patel@example.com','+44 7911 123456','Manchester, UK','Screening','DE-2026-010'],
    ['Tom Hiddleston','HR Business Partner','Apr 7, 2026','#HR-2026-002A','tom.hr@example.com','+1 (617) 555-4321','Boston, MA','Applied','HR-2026-002'],
    ['Alice Wonderland','Full Stack Developer','Apr 1, 2026','#CS-2026-001B','alice.w@example.com','+1 (512) 555-6789','Austin, TX','Task Round','CS-2026-001'],
    ['Zack Snyder','Physics Lab Technician','Apr 2, 2026','#PH-2026-005B','z.snyder@example.com','+1 (310) 555-0000','Los Angeles, CA','Screening','PH-2026-005'],
  ]
  for (const c of candidates) {
    await db.query(
      `INSERT INTO candidates (name,role_applied,applied_date,ref_id,email,phone,location,status,opening_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING`, c
    )
  }

  // ── Professor-facing candidates ───────────────────────────────────────────
  // Forwarded by Hiring Office for professor review / interview
  const nowMs = Date.now()
  const in10min   = new Date(nowMs + 10  * 60000).toISOString()
  const in50min   = new Date(nowMs + 50  * 60000).toISOString()
  const tomorrowT = new Date(nowMs + 26  * 3600000).toISOString()

  const professorCandidates = [
    // Status: "Professor Review" — appear in the Candidates for Review tab
    ['Elena Sokolov, PhD','Postdoctoral Fellow – Neuroscience Lab','Oct 20, 2023','#NEU-PROF-001',
     'elena.sokolov@stanford.edu','+1 (650) 555-0192','Stanford, CA',
     'Professor Review','NEU-2026-002', null],

    ['Marcus Aris','Graduate Research Assistant – Computational Biology','Oct 18, 2023','#BIO-PROF-001',
     'marcus.aris@mit.edu','+1 (617) 555-0328','Cambridge, MA',
     'Professor Review','BIO-2026-001', null],

    ['Linda Liao','Graduate Research Assistant – Computational Biology','Oct 16, 2023','#BIO-PROF-002',
     'linda.liao@oxford.ac.uk','+44 7700 012345','Oxford, UK',
     'Professor Review','BIO-2026-001', null],

    ['Dr. Robert Kim','Postdoctoral Fellow – Neuroscience Lab','Oct 14, 2023','#NEU-PROF-002',
     'r.kim@caltech.edu','+1 (626) 555-0177','Pasadena, CA',
     'Professor Review','NEU-2026-002', null],

    ['Mira Kapoor','Graduate Research Assistant – Computational Biology','Oct 22, 2023','#BIO-PROF-004',
     'mira.kapoor@iitk.ac.in','+91 84200 99877','New Delhi, India',
     'Professor Review','BIO-2026-001', null],

    // Status: "Interview Scheduled" — appear in Interview Schedule tab + sidebar panel
    ['Dr. Ananya Roy','Graduate Research Assistant – Computational Biology','Oct 10, 2023','#BIO-PROF-003',
     'ananya.roy@iitb.ac.in','+91 98200 11223','Mumbai, India',
     'Interview Scheduled','BIO-2026-001', in10min],

    ['Victor Sokolov','Lab Technician III – Genetics','Oct 8, 2023','#GEN-PROF-001',
     'v.sokolov@genetics.edu','+1 (424) 555-0099','Los Angeles, CA',
     'Interview Scheduled','GEN-2026-003', in50min],

    ['Dr. Fatima Al-Rashid','Postdoctoral Fellow – Neuroscience Lab','Oct 5, 2023','#NEU-PROF-003',
     'f.alrashid@uae.ac.ae','+971 50 111 2233','Abu Dhabi, UAE',
     'Interview Scheduled','NEU-2026-002', tomorrowT],
  ]

  for (const c of professorCandidates) {
    await db.query(
      `INSERT INTO candidates (name,role_applied,applied_date,ref_id,email,phone,location,status,opening_id,interview_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING`,
      c
    )
  }

  await db.query(
    `INSERT INTO candidates (id,name,role_applied,applied_date,ref_id,email,phone,location,status,opening_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING`,
    [31, 'Mira Kapoor', 'Graduate Research Assistant – Computational Biology', 'Oct 22, 2023', '#BIO-PROF-031', 'mira.kapoor@iitk.ac.in', '+91 84200 99877', 'New Delhi, India', 'Professor Review', 'BIO-2026-001']
  )

  // ── CHRO Candidates (approved by professors) ───────────────────────────────────
  const chroCandidates = [
    ['Dr. Ananya Roy','Graduate Research Assistant – Computational Biology','Oct 10, 2023','#BIO-PROF-003',
     'ananya.roy@iitb.ac.in','+91 98200 11223','Mumbai, India',
     'HR Round','BIO-2026-001', null],

    ['Victor Sokolov','Lab Technician III – Genetics','Oct 8, 2023','#GEN-PROF-001',
     'v.sokolov@genetics.edu','+1 (424) 555-0099','Los Angeles, CA',
     'HR Round','GEN-2026-003', null],

    ['Dr. Fatima Al-Rashid','Postdoctoral Fellow – Neuroscience Lab','Oct 5, 2023','#NEU-PROF-003',
     'f.alrashid@uae.ac.ae','+971 50 111 2233','Abu Dhabi, UAE',
     'HR Round','NEU-2026-002', null],

    ['Elena Sokolov, PhD','Postdoctoral Fellow – Neuroscience Lab','Oct 20, 2023','#NEU-PROF-001',
     'elena.sokolov@stanford.edu','+1 (650) 555-0192','Stanford, CA',
     'HR Round','NEU-2026-002', null],

    ['Marcus Aris','Graduate Research Assistant – Computational Biology','Oct 18, 2023','#BIO-PROF-001',
     'marcus.aris@mit.edu','+1 (617) 555-0328','Cambridge, MA',
     'HR Round','BIO-2026-001', null],
  ]

  for (const c of chroCandidates) {
    const [name,role,applied,ref,email,phone,loc,status,opening,interviewAt] = c
    await db.query(
      `INSERT INTO candidates (name,role_applied,applied_date,ref_id,email,phone,location,status,opening_id,interview_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING`,
      [name,role,applied,ref,email,phone,loc,status,opening,interviewAt]
    )
  }

  // ── Advanced candidate with full rich profile ─────────────────────────────
  const advCandidates = [
    ['Elena Rodriguez', 'Lead Data Scientist', 'Mar 17, 2026', '#HIR-2026-005', 'elena.rodriguez@email.com', '+34 612 345 678', 'Barcelona, Spain', 'Shortlisted', 'CS-2026-001',
      JSON.stringify(["Python","PyTorch","JAX","Bayesian Inference","LLM Fine-tuning","LoRA","Causal ML","Research Writing"]),
      JSON.stringify([{ inst:"Universitat Politecnica de Catalunya", degree:"Ph.D. Computational Statistics", detail:"Bayesian Methods, Class of 2020" }]),
      JSON.stringify([
        { q:"Describe a research project where your data science work led to a tangible impact.", a:"My doctoral research on causal inference for clinical trial analysis was adopted by a pharmaceutical company to redesign their patient stratification process. The Bayesian framework I developed reduced sample size requirements by 22% while maintaining statistical power." },
        { q:"Which ML framework do you prefer and why?", a:"JAX for research — the composable transforms and XLA compilation give me full control over computation graphs. PyTorch for production — the ecosystem and tooling maturity is unmatched for deployment pipelines." }
      ]),
      "Elena is an exceptionally strong candidate. Her depth in Bayesian methods and causal inference is rare, and she demonstrated clear readiness for a lead role.",
      "Exceptional Match",
      JSON.stringify([
        "Staff Data Scientist at Spotify: led Contextual Bandits personalisation system",
        "6 publications including NeurIPS 2023 spotlight paper",
        "Open source: BayesFlow library (1.2k GitHub stars)"
      ])
    ]
  ]

  for (const c of advCandidates) {
    await db.query(
      `INSERT INTO candidates (name,role_applied,applied_date,ref_id,email,phone,location,status,opening_id,skills,education_details,qa_responses,ai_summary,ai_match,resume_highlights)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) ON CONFLICT DO NOTHING`, c
    )
  }

  // ── JD Review ────────────────────────────────────────────────────────────
  await db.query(
    `INSERT INTO jd_reviews (opening_id, feedback, flags, reviewer_name) VALUES ($1,$2,$3,$4)`,
    ['CS-2026-001', 'The responsibilities section needs more specificity around the ML Engineering sub-domain. Please clarify whether the candidate is expected to lead model deployment or only training pipelines...', JSON.stringify(['Expand Scope', 'Clarification Required']), 'Prof. Anupam Sobti']
  )

  // ── Interview session ─────────────────────────────────────────────────────
  const simTranscript = [
    { speaker: 'Interviewer', text: "Dr. Roy, can you walk us through your doctoral research and how it relates to this role?", tag: null },
    { speaker: 'Candidate', text: "My PhD focused on sim-to-real transfer for robotic manipulation. I developed a domain randomisation framework that improved transfer success rates by 34% on our benchmark tasks.", tag: 'Academic Qualifications' },
    { speaker: 'Interviewer', text: "What is your publication record so far?", tag: null },
    { speaker: 'Candidate', text: "I have published 7 peer-reviewed papers — two in IEEE Robotics and Automation Letters, and one in ICRA 2023. My h-index is currently 8.", tag: 'Research Output' }
  ]

  await db.query(
    `INSERT INTO interview_sessions (candidate_id, transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status)
     SELECT id, $1, $2, 3.8, $3, 0, 0, 'Completed' FROM candidates WHERE name = 'Elena Rodriguez' LIMIT 1`,
    [JSON.stringify(simTranscript),
     JSON.stringify({'Academic Qualifications': 4.2, 'Research Output': 4.0, 'Teaching Demo': 3.2, 'Communication Skills': 4.1, 'Culture Fit': 3.9}),
     JSON.stringify({'Academic Qualifications': 0, 'Research Output': 0, 'Teaching Demo': 0, 'Communication Skills': 0, 'Culture Fit': 0})]
  )

  console.log('Seeded successfully')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
