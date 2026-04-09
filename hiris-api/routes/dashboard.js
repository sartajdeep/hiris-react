const router = require('express').Router()
const db = require('../db/pool')

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieves key performance indicators and counts for the dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pending_requests:
 *                   type: integer
 *                   description: Number of pending hiring requests
 *                 approved_requests:
 *                   type: integer
 *                   description: Number of approved hiring requests
 *                 active_openings:
 *                   type: integer
 *                   description: Number of active job openings
 *                 total_candidates:
 *                   type: integer
 *                   description: Total number of candidates
 *                 additionalProperties:
 *                   type: string
 *                   description: Additional KPI statistics from kpi_stats table
 */
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
