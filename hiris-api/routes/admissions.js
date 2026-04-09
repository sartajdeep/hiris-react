const router = require('express').Router()
const db = require('../db/pool')

// GET /api/admissions?opening_id=GA-2026-001
router.get('/', async (req, res) => {
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
router.get('/stats', async (req, res) => {
  const { opening_id } = req.query
  const params = opening_id ? [opening_id] : []
  const where  = opening_id ? 'WHERE opening_id=$1' : ''
  const [total, pending] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM candidates ${where}`, params),
    db.query(`SELECT COUNT(*) FROM candidates ${where} ${opening_id?'AND':'WHERE'} status='Under Review'`, params),
  ])
  res.json({ total: +total.rows[0].count, pending_review: +pending.rows[0].count })
})

router.patch('/:id/stage', async (req, res) => {
  await db.query('UPDATE admissions SET stage=$1 WHERE id=$2', [req.body.stage, req.params.id])
  res.json({ id: req.params.id, stage: req.body.stage })
})

module.exports = router
