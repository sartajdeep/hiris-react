/**
 * @swagger
 * /api/agenda:
 *   get:
 *     summary: List agenda events
 *     description: Returns agenda events for the given date, defaulting to today.
 *     tags:
 *       - Agenda
 *     parameters:
 *       - name: date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Event date filter
 *     responses:
 *       200:
 *         description: Agenda event list
 */

/**
 * @swagger
 * /api/agenda:
 *   post:
 *     summary: Create an agenda event
 *     tags:
 *       - Agenda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               time_start:
 *                 type: string
 *               time_end:
 *                 type: string
 *               time_label:
 *                 type: string
 *               top_px:
 *                 type: integer
 *               height_px:
 *                 type: integer
 *               variant:
 *                 type: string
 *               event_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Agenda event created
 */

/**
 * @swagger
 * /api/agenda/{id}:
 *   delete:
 *     summary: Delete an agenda event
 *     tags:
 *       - Agenda
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agenda event deleted
 */

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
