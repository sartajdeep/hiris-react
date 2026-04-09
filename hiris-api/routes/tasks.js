const router = require('express').Router()
const db = require('../db/pool')

router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM tasks WHERE completed=false ORDER BY created_at DESC')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { text, priority, due_date } = req.body
  const { rows } = await db.query(
    'INSERT INTO tasks (text,priority,due_date) VALUES ($1,$2,$3) RETURNING id',
    [text, priority || 'Medium', due_date || null]
  )
  res.status(201).json({ id: rows[0].id })
})

router.patch('/:id/complete', async (req, res) => {
  await db.query('UPDATE tasks SET completed=true WHERE id=$1', [req.params.id])
  res.json({ id: req.params.id, completed: true })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM tasks WHERE id=$1', [req.params.id])
  res.json({ deleted: req.params.id })
})

module.exports = router
