const router = require('express').Router()
const db = require('../db/pool')

router.get('/', async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0]
  const { rows } = await db.query(
    'SELECT * FROM agenda_events WHERE event_date=$1 ORDER BY top_px ASC', [date]
  )
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { title, subtitle, time_start, time_end, time_label, top_px, height_px, variant, event_date } = req.body
  const { rows } = await db.query(
    `INSERT INTO agenda_events (title,subtitle,time_start,time_end,time_label,top_px,height_px,variant,event_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [title, subtitle, time_start, time_end, time_label, top_px, height_px, variant || 'default', event_date]
  )
  res.status(201).json({ id: rows[0].id })
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM agenda_events WHERE id=$1', [req.params.id])
  res.json({ deleted: req.params.id })
})

module.exports = router
