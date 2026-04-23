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

const router = require('express').Router()
const db     = require('../db/pool')
const upload = require('../middleware/upload')

// POST /api/applications — submit application (multipart/form-data)
router.post('/', upload.fields([{ name:'resume', maxCount:1 }, { name:'cv', maxCount:1 }]), async (req, res) => {
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
router.get('/token/:token', async (req, res) => {
  const { rows } = await db.query('SELECT id, token, status, submitted_at FROM applications WHERE token=$1', [req.params.token])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// GET /api/applications — list all (admin)
router.get('/', async (req, res) => {
  const { opening_id } = req.query
  let q = 'SELECT * FROM applications'
  const params = []
  if (opening_id) { params.push(opening_id); q += ' WHERE opening_id=$1' }
  q += ' ORDER BY submitted_at DESC'
  const { rows } = await db.query(q, params)
  res.json(rows)
})

// PATCH /api/applications/:id/status
router.patch('/:id/status', async (req, res) => {
  await db.query('UPDATE applications SET status=$1 WHERE id=$2', [req.body.status, req.params.id])
  res.json({ id: req.params.id, status: req.body.status })
})

module.exports = router
