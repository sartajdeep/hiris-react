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

const router = require('express').Router()
const db = require('../db/pool')

// GET /api/chro/kpis
router.get('/kpis', async (req, res) => {
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
router.get('/approvals', async (req, res) => {
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
router.get('/department_pipeline', async (req, res) => {
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
router.patch('/headcount/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    let newStatus = status === 'approved' ? 'Approved' : 'Rejected';
    await db.query('UPDATE hiring_requests SET status = $1 WHERE id = $2', [newStatus, req.params.id])
    res.json({ success: true })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
