const express = require('express');
const db = require('../db/pool');


const mainRouter = express.Router();

// === jobs.js ===
const jobsRouter = express.Router();
/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: List job role records
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: department
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of job roles
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job role by ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job role details
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a job role record
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               department:
 *                 type: string
 *               request_id:
 *                 type: string
 *               opening_id:
 *                 type: string
 *               professor_id:
 *                 type: string
 *               hiring_manager_id:
 *                 type: string
 *               stage:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job role created
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   patch:
 *     summary: Update a job role record
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_id:
 *                 type: string
 *               opening_id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               department:
 *                 type: string
 *               professor_id:
 *                 type: string
 *               hiring_manager_id:
 *                 type: string
 *               stage:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job role updated
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job role record
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job role deleted
 */




// GET /api/jobs
jobsRouter.get('/', async (req, res) => {
  const { department, status } = req.query
  let q = 'SELECT * FROM job_roles WHERE 1=1'
  const params = []
  if (department) { params.push(department); q += ` AND department=$${params.length}` }
  if (status)     { params.push(status);     q += ` AND status=$${params.length}` }
  q += ' ORDER BY created_at DESC'

  const { rows } = await db.query(q, params)
  res.json(rows)
})

jobsRouter.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM job_roles WHERE id=$1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

jobsRouter.post('/', async (req, res) => {
  const {
    id = `ROLE-${Date.now()}`,
    request_id = null,
    opening_id = null,
    title,
    description,
    department,
    professor_id = null,
    hiring_manager_id = null,
    stage = 'Request',
    status = 'Draft'
  } = req.body

  if (!title) return res.status(400).json({ error: 'title is required' })

  const { rows } = await db.query(
    `INSERT INTO job_roles
      (id, request_id, opening_id, title, description, department, professor_id, hiring_manager_id, stage, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [id, request_id, opening_id, title, description, department, professor_id, hiring_manager_id, stage, status]
  )
  res.status(201).json(rows[0])
})

jobsRouter.patch('/:id', async (req, res) => {
  const {
    request_id,
    opening_id,
    title,
    description,
    department,
    professor_id,
    hiring_manager_id,
    stage,
    status
  } = req.body

  await db.query(
    `UPDATE job_roles SET
      request_id = COALESCE($1, request_id),
      opening_id = COALESCE($2, opening_id),
      title = COALESCE($3, title),
      description = COALESCE($4, description),
      department = COALESCE($5, department),
      professor_id = COALESCE($6, professor_id),
      hiring_manager_id = COALESCE($7, hiring_manager_id),
      stage = COALESCE($8, stage),
      status = COALESCE($9, status)
     WHERE id=$10`,
    [request_id, opening_id, title, description, department, professor_id, hiring_manager_id, stage, status, req.params.id]
  )

  const { rows } = await db.query('SELECT * FROM job_roles WHERE id=$1', [req.params.id])
  res.json(rows[0])
})

jobsRouter.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM job_roles WHERE id=$1', [req.params.id])
  res.json({ deleted: req.params.id })
})



mainRouter.use('/jobs', jobsRouter);

// === admissions.js ===
const admissionsRouter = express.Router();
/**
 * @swagger
 * /api/admissions:
 *   get:
 *     summary: List admissions records
 *     description: Returns admissions records optionally filtered by opening_id.
 *     tags:
 *       - Admissions
 *     parameters:
 *       - name: opening_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by opening ID
 *     responses:
 *       200:
 *         description: Admissions list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */

/**
 * @swagger
 * /api/admissions/stats:
 *   get:
 *     summary: Get admissions statistics
 *     tags:
 *       - Admissions
 *     parameters:
 *       - name: opening_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Optional opening ID filter
 *     responses:
 *       200:
 *         description: Admissions statistics
 */

/**
 * @swagger
 * /api/admissions/{id}/stage:
 *   patch:
 *     summary: Update admissions stage
 *     tags:
 *       - Admissions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated stage
 */




// GET /api/admissions?opening_id=GA-2026-001
admissionsRouter.get('/', async (req, res) => {
  const { opening_id } = req.query
  let q = `SELECT a.*, c.name as candidate_name, c.email, c.ref_id
           FROM admissions a JOIN candidates c ON a.candidate_id=c.id`
  const params = []
  if (opening_id) { params.push(opening_id); q += ` WHERE a.opening_id=$1` }
  q += ' ORDER BY a.created_at DESC'
  const { rows } = await db.query(q, params)
  res.json(rows)
})

// GET /api/admissions/stats?opening_id=GA-2026-001
admissionsRouter.get('/stats', async (req, res) => {
  const { opening_id } = req.query
  const params = opening_id ? [opening_id] : []
  const where  = opening_id ? 'WHERE opening_id=$1' : ''
  const [total, pending] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM candidates ${where}`, params),
    db.query(`SELECT COUNT(*) FROM candidates ${where} ${opening_id?'AND':'WHERE'} status='Under Review'`, params),
  ])
  res.json({ total: +total.rows[0].count, pending_review: +pending.rows[0].count })
})

admissionsRouter.patch('/:id/stage', async (req, res) => {
  await db.query('UPDATE admissions SET stage=$1 WHERE id=$2', [req.body.stage, req.params.id])
  res.json({ id: req.params.id, stage: req.body.stage })
})



mainRouter.use('/admissions', admissionsRouter);

// === activeOpenings.js ===
const activeopeningsRouter = express.Router();
/**
 * @swagger
 * /api/active-openings:
 *   get:
 *     summary: List active job openings
 *     description: Retrieve open job postings with optional filtering by tag or status.
 *     tags:
 *       - Active Openings
 *     parameters:
 *       - name: tag
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter openings by tag
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter openings by status
 *     responses:
 *       200:
 *         description: A list of open active openings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/active-openings/{id}:
 *   get:
 *     summary: Get a single active opening
 *     tags:
 *       - Active Openings
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Active opening details
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/active-openings:
 *   post:
 *     summary: Create an active opening
 *     tags:
 *       - Active Openings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               tag:
 *                 type: string
 *               department:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Created active opening
 */

/**
 * @swagger
 * /api/active-openings/{id}/close:
 *   patch:
 *     summary: Close an active opening
 *     tags:
 *       - Active Openings
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opening closed
 */

/**
 * @swagger
 * /api/active-openings/{id}/candidate-count:
 *   patch:
 *     summary: Increment candidate count for an opening
 *     tags:
 *       - Active Openings
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate count incremented
 */




activeopeningsRouter.get('/', async (req, res) => {
  const { tag, status } = req.query
  let q = 'SELECT * FROM active_openings WHERE is_open=true'
  const params = []
  if (tag)    { params.push(tag);    q += ` AND tag=$${params.length}` }
  if (status) { params.push(status); q += ` AND status=$${params.length}` }
  const { rows } = await db.query(q, params)
  res.json(rows)
})

activeopeningsRouter.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM active_openings WHERE id=$1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

activeopeningsRouter.post('/', async (req, res) => {
  const { id, title, tag, department, deadline } = req.body
  await db.query(
    'INSERT INTO active_openings (id,title,tag,department,deadline) VALUES ($1,$2,$3,$4,$5)',
    [id, title, tag, department, deadline]
  )
  res.status(201).json({ id })
})

activeopeningsRouter.patch('/:id/close', async (req, res) => {
  await db.query('UPDATE active_openings SET is_open=false WHERE id=$1', [req.params.id])
  res.json({ id: req.params.id, is_open: false })
})

activeopeningsRouter.patch('/:id/candidate-count', async (req, res) => {
  await db.query('UPDATE active_openings SET candidates=candidates+1 WHERE id=$1', [req.params.id])
  res.json({ updated: true })
})



mainRouter.use('/active-openings', activeopeningsRouter);

// === applications.js ===
const applicationsRouter = express.Router();
/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit a job application
 *     tags:
 *       - Applications
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               opening_id:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               linkedin_url:
 *                 type: string
 *               github_url:
 *                 type: string
 *               cover_note:
 *                 type: string
 *               education:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted
 */

/**
 * @swagger
 * /api/applications/token/{token}:
 *   get:
 *     summary: Get application status by token
 *     tags:
 *       - Applications
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application status page data
 *       404:
 *         description: Token not found
 */

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: List applications
 *     tags:
 *       - Applications
 *     parameters:
 *       - name: opening_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter applications by opening
 *     responses:
 *       200:
 *         description: List of applications
 */

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     tags:
 *       - Applications
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */



const upload = require('../middleware/upload')

// POST /api/applications — submit application (multipart/form-data)
applicationsRouter.post('/', upload.fields([{ name:'resume', maxCount:1 }, { name:'cv', maxCount:1 }]), async (req, res) => {
  const { opening_id, full_name, email, phone, linkedin_url, github_url, cover_note, education } = req.body
  const resume_path = req.files?.resume?.[0]?.path || null
  const cv_path     = req.files?.cv?.[0]?.path     || null

  const { rows } = await db.query(
    `INSERT INTO applications
       (opening_id,full_name,email,phone,linkedin_url,github_url,cover_note,resume_path,cv_path,education)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, token`,
    [opening_id, full_name, email, phone, linkedin_url, github_url, cover_note,
     resume_path, cv_path, education ? JSON.parse(education) : null]
  )

  // Increment candidate count on opening
  if (opening_id) {
    await db.query('UPDATE active_openings SET candidates=candidates+1 WHERE id=$1', [opening_id])
  }

  res.status(201).json({ id: rows[0].id, token: rows[0].token })
})

// GET /api/applications/:token — look up by token (for applicant)
applicationsRouter.get('/token/:token', async (req, res) => {
  const { rows } = await db.query('SELECT id, token, status, submitted_at FROM applications WHERE token=$1', [req.params.token])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// GET /api/applications — list all (admin)
applicationsRouter.get('/', async (req, res) => {
  const { opening_id } = req.query
  let q = 'SELECT * FROM applications'
  const params = []
  if (opening_id) { params.push(opening_id); q += ' WHERE opening_id=$1' }
  q += ' ORDER BY submitted_at DESC'
  const { rows } = await db.query(q, params)
  res.json(rows)
})

// PATCH /api/applications/:id/status
applicationsRouter.patch('/:id/status', async (req, res) => {
  await db.query('UPDATE applications SET status=$1 WHERE id=$2', [req.body.status, req.params.id])
  res.json({ id: req.params.id, status: req.body.status })
})



mainRouter.use('/applications', applicationsRouter);

module.exports = mainRouter;
