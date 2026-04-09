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

const router = require('express').Router()
const db = require('../db/pool')

router.get('/:candidate_id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM interview_sessions WHERE candidate_id=$1 ORDER BY conducted_at DESC', [req.params.candidate_id])
  res.json(rows[0] || null)
})

// Root POST — called by Professor's interview room
router.post('/', async (req, res) => {
  const { candidate_id, transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status } = req.body
  const { rows } = await db.query(
    `INSERT INTO interview_sessions 
    (candidate_id, transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [candidate_id, JSON.stringify(transcript||{}), JSON.stringify(ai_scores||{}), ai_overall||null, JSON.stringify(manual_scores||{}), manual_overall||null, composite_score||null, status]
  )
  res.json(rows[0])
})

router.post('/:candidate_id', async (req, res) => {
  const { transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status } = req.body
  const { rows } = await db.query(
    `INSERT INTO interview_sessions 
    (candidate_id, transcript, ai_scores, ai_overall, manual_scores, manual_overall, composite_score, status) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.params.candidate_id, JSON.stringify(transcript), JSON.stringify(ai_scores), ai_overall, JSON.stringify(manual_scores), manual_overall, composite_score, status]
  )
  res.json(rows[0])
})

module.exports = router

