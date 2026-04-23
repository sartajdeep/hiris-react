const express = require('express');
const db = require('../db/pool');


const mainRouter = express.Router();

// === chro.js ===
const chroRouter = express.Router();
/**
 * @swagger
 * /api/chro/kpis:
 *   get:
 *     summary: Get CHRO dashboard KPIs
 *     tags:
 *       - CHRO
 *     responses:
 *       200:
 *         description: CHRO KPI summary
 */

/**
 * @swagger
 * /api/chro/approvals:
 *   get:
 *     summary: Get pending approval requests
 *     tags:
 *       - CHRO
 *     responses:
 *       200:
 *         description: Pending approval list
 */

/**
 * @swagger
 * /api/chro/department_pipeline:
 *   get:
 *     summary: Get department hiring pipeline data
 *     tags:
 *       - CHRO
 *     responses:
 *       200:
 *         description: Department pipeline data
 */

/**
 * @swagger
 * /api/chro/headcount/{id}/status:
 *   patch:
 *     summary: Update headcount approval status
 *     tags:
 *       - CHRO
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
 *         description: Headcount status updated
 */




// GET /api/chro/kpis
chroRouter.get('/kpis', async (req, res) => {
  try {
    const [openPositions, activeApplicants, pendingActions] = await Promise.all([
      db.query('SELECT COUNT(*) FROM active_openings WHERE is_open=true'),
      db.query('SELECT COUNT(*) FROM candidates'),
      db.query("SELECT COUNT(*) FROM hiring_requests WHERE status='Pending Review'")
    ])
    
    res.json({
      openPositions: +openPositions.rows[0].count,
      activeApplicants: +activeApplicants.rows[0].count,
      pendingActions: +pendingActions.rows[0].count,
    })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/chro/approvals
chroRouter.get('/approvals', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM hiring_requests WHERE status='Pending Review' ORDER BY created_at DESC LIMIT 10")
    // Map to what CHRODashboard expects: { id, title, dept, requestor, urgency, badge }
    const mapped = result.rows.map(r => ({
      id: r.id,
      title: r.title + ' × ' + r.positions,
      dept: r.department,
      requestor: r.requested_by,
      urgency: 'Medium',
      badge: 'badge-amber'
    }))
    res.json(mapped)
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/chro/department_pipeline
chroRouter.get('/department_pipeline', async (req, res) => {
  try {
    const defaultPipeline = [
      { code: 'CS', name: 'Computer Science', open: 8, interviewing: 6, offered: 2, status: 'On Track', badge: 'badge-green', color: 'rgba(40,102,110,.1)', textColor: 'var(--teal)' },
      { code: 'LS', name: 'Life Sciences',    open: 5, interviewing: 3, offered: 1, status: 'Delayed',  badge: 'badge-amber', color: 'rgba(147,51,234,.1)',  textColor: '#7C3AED' },
      { code: 'AD', name: 'Administration',   open: 6, interviewing: 8, offered: 3, status: 'At Risk',  badge: 'badge-red',   color: 'rgba(234,88,12,.1)',  textColor: '#EA580C' },
      { code: 'EE', name: 'Electrical Engg.', open: 4, interviewing: 4, offered: 0, status: 'On Track', badge: 'badge-green', color: 'rgba(37,99,235,.1)',  textColor: '#2563EB' },
    ];
    res.json(defaultPipeline)
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
})

// PATCH /api/headcount/:id/status
chroRouter.patch('/headcount/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    let newStatus = status === 'approved' ? 'Approved' : 'Rejected';
    await db.query('UPDATE hiring_requests SET status = $1 WHERE id = $2', [newStatus, req.params.id])
    res.json({ success: true })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
})



mainRouter.use('/chro', chroRouter);

// === hiringRequests.js ===
const hiringrequestsRouter = express.Router();
/**
 * @swagger
 * /api/hiring-requests:
 *   get:
 *     summary: List hiring requests
 *     tags:
 *       - Hiring Requests
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: job_type
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of hiring requests
 */

/**
 * @swagger
 * /api/hiring-requests/{id}:
 *   get:
 *     summary: Get a hiring request by ID
 *     tags:
 *       - Hiring Requests
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hiring request details
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/hiring-requests:
 *   post:
 *     summary: Create a hiring request
 *     tags:
 *       - Hiring Requests
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
 *               location:
 *                 type: string
 *               requested_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hiring request created
 */

/**
 * @swagger
 * /api/hiring-requests/{id}/status:
 *   patch:
 *     summary: Update hiring request status
 *     tags:
 *       - Hiring Requests
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

/**
 * @swagger
 * /api/hiring-requests/{id}:
 *   patch:
 *     summary: Update hiring request details
 *     tags:
 *       - Hiring Requests
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               job_type:
 *                 type: string
 *               department:
 *                 type: string
 *               positions:
 *                 type: integer
 *               start_date:
 *                 type: string
 *               deadline:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hiring request updated
 */

/**
 * @swagger
 * /api/hiring-requests/{id}:
 *   delete:
 *     summary: Delete a hiring request
 *     tags:
 *       - Hiring Requests
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hiring request deleted
 */




hiringrequestsRouter.get('/', async (req, res) => {
  const { status, job_type } = req.query
  let q = 'SELECT * FROM hiring_requests WHERE 1=1'
  const params = []
  if (status)   { params.push(status);   q += ` AND status=$${params.length}` }
  if (job_type) { params.push(job_type); q += ` AND job_type=$${params.length}` }
  q += ' ORDER BY created_at DESC'
  const { rows } = await db.query(q, params)
  res.json(rows)
})

hiringrequestsRouter.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM hiring_requests WHERE id=$1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// Professor: create a new hire request with rough info
hiringrequestsRouter.post('/', async (req, res) => {
  const { title, description, location, requested_by } = req.body
  const id = `REQ-${Date.now()}`
  const { rows } = await db.query(
    `INSERT INTO hiring_requests (id, title, description, location, requested_by, department, job_type, positions, start_date, deadline)
     VALUES ($1, $2, $3, $4, $5, 'TBD', 'Full-time', 1, 'TBD', CURRENT_DATE + INTERVAL '90 days') RETURNING *`,
    [id, title, description, location, requested_by || 'Professor']
  )
  res.status(201).json(rows[0])
})

// Hiring Assistant: update status (includes 'Sent for Approval' etc.)
hiringrequestsRouter.patch('/:id/status', async (req, res) => {
  await db.query('UPDATE hiring_requests SET status=$1 WHERE id=$2', [req.body.status, req.params.id])
  res.json({ id: req.params.id, status: req.body.status })
})

// Hiring assistant: update JD details (autofill from professor's request)
hiringrequestsRouter.patch('/:id', async (req, res) => {
  const { title, description, location, job_type, department, positions, start_date, deadline } = req.body
  await db.query(
    `UPDATE hiring_requests SET
      title=COALESCE($1, title),
      description=COALESCE($2, description),
      location=COALESCE($3, location),
      job_type=COALESCE($4, job_type),
      department=COALESCE($5, department),
      positions=COALESCE($6, positions),
      start_date=COALESCE($7, start_date),
      deadline=COALESCE($8::date, deadline)
    WHERE id=$9`,
    [title, description, location, job_type, department, positions, start_date, deadline, req.params.id]
  )
  const { rows } = await db.query('SELECT * FROM hiring_requests WHERE id=$1', [req.params.id])
  res.json(rows[0])
})

hiringrequestsRouter.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM hiring_requests WHERE id=$1', [req.params.id])
  res.json({ deleted: req.params.id })
})



mainRouter.use('/hiring-requests', hiringrequestsRouter);

// === interviewSessions.js ===
const interviewsessionsRouter = express.Router();
/**
 * @swagger
 * /api/interview-sessions/{candidate_id}:
 *   get:
 *     summary: Get the latest interview session for a candidate
 *     tags:
 *       - Interview Sessions
 *     parameters:
 *       - name: candidate_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Latest interview session or null
 */

/**
 * @swagger
 * /api/interview-sessions:
 *   post:
 *     summary: Create a new interview session
 *     tags:
 *       - Interview Sessions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               candidate_id:
 *                 type: string
 *               transcript:
 *                 type: object
 *               ai_scores:
 *                 type: object
 *               ai_overall:
 *                 type: number
 *               manual_scores:
 *                 type: object
 *               manual_overall:
 *                 type: number
 *               composite_score:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interview session created
 */

/**
 * @swagger
 * /api/interview-sessions/{candidate_id}:
 *   post:
 *     summary: Create a new interview session for a candidate
 *     tags:
 *       - Interview Sessions
 *     parameters:
 *       - name: candidate_id
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
 *               transcript:
 *                 type: object
 *               ai_scores:
 *                 type: object
 *               ai_overall:
 *                 type: number
 *               manual_scores:
 *                 type: object
 *               manual_overall:
 *                 type: number
 *               composite_score:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Interview session created for candidate
 */




interviewsessionsRouter.get('/:candidate_id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM interview_sessions WHERE candidate_id=$1 ORDER BY conducted_at DESC', [req.params.candidate_id])
  res.json(rows[0] || null)
})

// Root POST — called by Professor's interview room
interviewsessionsRouter.post('/', async (req, res) => {
  const { candidate_id, transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status } = req.body
  const { rows } = await db.query(
    `INSERT INTO interview_sessions 
    (candidate_id, transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [candidate_id, JSON.stringify(transcript||{}), JSON.stringify(ai_scores||{}), ai_overall||null, JSON.stringify(manual_scores||{}), manual_overall||null, composite_score||null, status]
  )
  res.json(rows[0])
})

interviewsessionsRouter.post('/:candidate_id', async (req, res) => {
  const { transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status } = req.body
  const { rows } = await db.query(
    `INSERT INTO interview_sessions 
    (candidate_id, transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.params.candidate_id, JSON.stringify(transcript), JSON.stringify(ai_scores), ai_overall, JSON.stringify(manual_scores), manual_overall, composite_score, status]
  )
  res.json(rows[0])
})




mainRouter.use('/interview-sessions', interviewsessionsRouter);

module.exports = mainRouter;
