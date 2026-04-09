const router = require('express').Router()
const db = require('../db/pool')

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  const [kpi, pending, approved, openings, totalCandidates] = await Promise.all([
    db.query('SELECT key, value FROM kpi_stats'),
    db.query("SELECT COUNT(*) FROM hiring_requests WHERE status='Pending Review'"),
    db.query("SELECT COUNT(*) FROM hiring_requests WHERE status='Approved'"),
    db.query('SELECT COUNT(*) FROM active_openings WHERE is_open=true'),
    db.query('SELECT COUNT(*) FROM candidates'),
  ])
  const stats = Object.fromEntries(kpi.rows.map(r => [r.key, r.value]))
  stats.pending_requests  = +pending.rows[0].count
  stats.approved_requests = +approved.rows[0].count
  stats.active_openings   = +openings.rows[0].count
  stats.total_candidates  = +totalCandidates.rows[0].count
  res.json(stats)
})

module.exports = router
