const router = require('express').Router()
const db = require('../db/pool')

router.get('/', async (req, res) => {
  const { tag, status } = req.query
  let q = 'SELECT * FROM active_openings WHERE is_open=true'
  const params = []
  if (tag)    { params.push(tag);    q += ` AND tag=$${params.length}` }
  if (status) { params.push(status); q += ` AND status=$${params.length}` }
  const { rows } = await db.query(q, params)
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM active_openings WHERE id=$1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  const { id, title, tag, department, deadline } = req.body
  await db.query(
    'INSERT INTO active_openings (id,title,tag,department,deadline) VALUES ($1,$2,$3,$4,$5)',
    [id, title, tag, department, deadline]
  )
  res.status(201).json({ id })
})

router.patch('/:id/close', async (req, res) => {
  await db.query('UPDATE active_openings SET is_open=false WHERE id=$1', [req.params.id])
  res.json({ id: req.params.id, is_open: false })
})

router.patch('/:id/candidate-count', async (req, res) => {
  await db.query('UPDATE active_openings SET candidates=candidates+1 WHERE id=$1', [req.params.id])
  res.json({ updated: true })
})

module.exports = router
