const router = require('express').Router()
const db = require('../db/pool')

router.get('/', async (req, res) => {
  const { status, job_type } = req.query
  let q = 'SELECT * FROM hiring_requests WHERE 1=1'
  const params = []
  if (status)   { params.push(status);   q += ` AND status=$${params.length}` }
  if (job_type) { params.push(job_type); q += ` AND job_type=$${params.length}` }
  q += ' ORDER BY created_at DESC'
  const { rows } = await db.query(q, params)
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM hiring_requests WHERE id=$1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// Professor: create a new hire request with rough info
router.post('/', async (req, res) => {
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
router.patch('/:id/status', async (req, res) => {
  await db.query('UPDATE hiring_requests SET status=$1 WHERE id=$2', [req.body.status, req.params.id])
  res.json({ id: req.params.id, status: req.body.status })
})

// Hiring assistant: update JD details (autofill from professor's request)
router.patch('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM hiring_requests WHERE id=$1', [req.params.id])
  res.json({ deleted: req.params.id })
})

module.exports = router
