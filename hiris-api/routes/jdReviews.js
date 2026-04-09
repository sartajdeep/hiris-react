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

const router = require('express').Router()
const db = require('../db/pool')

router.get('/:opening_id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM jd_reviews WHERE opening_id=$1 ORDER BY submitted_at DESC', [req.params.opening_id])
  res.json(rows[0] || null)
})

router.post('/:opening_id', async (req, res) => {
  const { feedback, flags, reviewer_name } = req.body
  const { rows } = await db.query(
    'INSERT INTO jd_reviews (opening_id, feedback, flags, reviewer_name) VALUES ($1,$2,$3,$4) RETURNING *',
    [req.params.opening_id, feedback, JSON.stringify(flags), reviewer_name]
  )
  res.json(rows[0])
})

module.exports = router
