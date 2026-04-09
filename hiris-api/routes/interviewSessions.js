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

