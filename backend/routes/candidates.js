const express = require('express');
const db = require('../db/pool');


const mainRouter = express.Router();

// === candidates.js ===
const candidatesRouter = express.Router();
/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: List candidates
 *     tags:
 *       - Candidates
 *     parameters:
 *       - name: opening_id
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate list
 */

/**
 * @swagger
 * /api/candidates/{id}:
 *   get:
 *     summary: Get candidate by ID
 *     tags:
 *       - Candidates
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate details
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/candidates/{id}/status:
 *   patch:
 *     summary: Update candidate status
 *     tags:
 *       - Candidates
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
 *               interview_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Candidate status updated
 */




candidatesRouter.get('/', async (req, res) => {
  const { opening_id, status } = req.query
  let q = 'SELECT * FROM candidates WHERE 1=1'
  const params = []
  if (opening_id) { params.push(opening_id); q += ` AND opening_id=$${params.length}` }
  if (status)     { params.push(status);     q += ` AND status=$${params.length}` }
  q += ' ORDER BY created_at DESC'
  const { rows } = await db.query(q, params)
  res.json(rows)
})

candidatesRouter.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM candidates WHERE id=$1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

candidatesRouter.patch('/:id/status', async (req, res) => {
  const { status, interview_at } = req.body
  if (interview_at) {
    await db.query('UPDATE candidates SET status=$1, interview_at=$2 WHERE id=$3', [status, interview_at, req.params.id])
  } else {
    await db.query('UPDATE candidates SET status=$1 WHERE id=$2', [status, req.params.id])
  }
  res.json({ id: req.params.id, status })
})



mainRouter.use('/candidates', candidatesRouter);

// === jdReviews.js ===
const jdreviewsRouter = express.Router();
/**
 * @swagger
 * /api/jd-reviews/{opening_id}:
 *   get:
 *     summary: Get JD review for a given opening
 *     tags:
 *       - JD Reviews
 *     parameters:
 *       - name: opening_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JD review details or null
 */

/**
 * @swagger
 * /api/jd-reviews/{opening_id}:
 *   post:
 *     summary: Submit JD review feedback
 *     tags:
 *       - JD Reviews
 *     parameters:
 *       - name: opening_id
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
 *               feedback:
 *                 type: string
 *               flags:
 *                 type: array
 *                 items:
 *                   type: string
 *               reviewer_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: JD review created
 */




jdreviewsRouter.get('/:opening_id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM jd_reviews WHERE opening_id=$1 ORDER BY submitted_at DESC', [req.params.opening_id])
  res.json(rows[0] || null)
})

jdreviewsRouter.post('/:opening_id', async (req, res) => {
  const { feedback, flags, reviewer_name } = req.body
  const { rows } = await db.query(
    'INSERT INTO jd_reviews (opening_id, feedback, flags, reviewer_name) VALUES ($1,$2,$3,$4) RETURNING *',
    [req.params.opening_id, feedback, JSON.stringify(flags), reviewer_name]
  )
  res.json(rows[0])
})



mainRouter.use('/jd-reviews', jdreviewsRouter);

module.exports = mainRouter;
