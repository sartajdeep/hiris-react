const express = require('express');
const db = require('../db/pool');


const mainRouter = express.Router();

// === dashboard.js ===
const dashboardRouter = express.Router();



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
dashboardRouter.get('/stats', async (req, res) => {
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



mainRouter.use('/dashboard', dashboardRouter);

// === agenda.js ===
const agendaRouter = express.Router();
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




agendaRouter.get('/', async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0]
  const { rows } = await db.query(
    'SELECT * FROM agenda_events WHERE event_date=$1 ORDER BY top_px ASC', [date]
  )
  res.json(rows)
})

agendaRouter.post('/', async (req, res) => {
  const { title, subtitle, time_start, time_end, time_label, top_px, height_px, variant, event_date } = req.body
  const { rows } = await db.query(
    `INSERT INTO agenda_events (title,subtitle,time_start,time_end,time_label,top_px,height_px,variant,event_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [title, subtitle, time_start, time_end, time_label, top_px, height_px, variant || 'default', event_date]
  )
  res.status(201).json({ id: rows[0].id })
})

agendaRouter.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM agenda_events WHERE id=$1', [req.params.id])
  res.json({ deleted: req.params.id })
})



mainRouter.use('/agenda', agendaRouter);

// === tasks.js ===
const tasksRouter = express.Router();
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: List open tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Task list
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               priority:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created
 */

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   patch:
 *     summary: Mark task as complete
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task completed
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */




tasksRouter.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM tasks WHERE completed=false ORDER BY created_at DESC')
  res.json(rows)
})

tasksRouter.post('/', async (req, res) => {
  const { text, priority, due_date } = req.body
  const { rows } = await db.query(
    'INSERT INTO tasks (text,priority,due_date) VALUES ($1,$2,$3) RETURNING id',
    [text, priority || 'Medium', due_date || null]
  )
  res.status(201).json({ id: rows[0].id })
})

tasksRouter.patch('/:id/complete', async (req, res) => {
  await db.query('UPDATE tasks SET completed=true WHERE id=$1', [req.params.id])
  res.json({ id: req.params.id, completed: true })
})

tasksRouter.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM tasks WHERE id=$1', [req.params.id])
  res.json({ deleted: req.params.id })
})



mainRouter.use('/tasks', tasksRouter);

// === departments.js ===
const departmentsRouter = express.Router();
/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: List all departments
 *     tags:
 *       - Departments
 *     responses:
 *       200:
 *         description: Department list
 */

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a department
 *     tags:
 *       - Departments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created
 */

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     tags:
 *       - Departments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department deleted
 */




departmentsRouter.get('/',    async (req, res) => { const {rows} = await db.query('SELECT * FROM departments ORDER BY id'); res.json(rows) })
departmentsRouter.post('/',   async (req, res) => { await db.query('INSERT INTO departments VALUES ($1,$2)', [req.body.id, req.body.name]); res.status(201).json({ id: req.body.id }) })
departmentsRouter.delete('/:id', async (req, res) => { await db.query('DELETE FROM departments WHERE id=$1', [req.params.id]); res.json({ deleted: req.params.id }) })



mainRouter.use('/departments', departmentsRouter)

// === organisations.js ===
const orgsRouter = express.Router()

// Auto-create tables if they don't exist (no manual migration needed)
;(async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS organisations (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      website     TEXT,
      industry    TEXT,
      size        TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  await db.query(`
    CREATE TABLE IF NOT EXISTS org_users (
      id          SERIAL PRIMARY KEY,
      org_id      TEXT REFERENCES organisations(id) ON DELETE CASCADE,
      name        TEXT,
      email       TEXT NOT NULL,
      role        TEXT,
      portal      TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `)
})().catch(console.error)

/**
 * @swagger
 * /api/organisations:
 *   post:
 *     summary: Register a new organisation and invited users
 *     tags: [Organisations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               org:
 *                 type: object
 *               users:
 *                 type: array
 *     responses:
 *       201:
 *         description: Organisation registered
 */
orgsRouter.post('/', async (req, res) => {
  const { org, users = [] } = req.body
  const orgId = `org-${Date.now()}`

  await db.query(
    'INSERT INTO organisations (id, name, website, industry, size) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING',
    [orgId, org.name, org.website || null, org.industry || null, org.size || null]
  )

  for (const u of users) {
    await db.query(
      'INSERT INTO org_users (org_id, name, email, role, portal) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',
      [orgId, u.name || null, u.email, u.role || null, u.portal || null]
    )
  }

  res.status(201).json({ orgId, usersCreated: users.length })
})

/**
 * @swagger
 * /api/organisations:
 *   get:
 *     summary: List all registered organisations
 *     tags: [Organisations]
 *     responses:
 *       200:
 *         description: Organisation list
 */
orgsRouter.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM organisations ORDER BY created_at DESC')
  res.json(rows)
})

mainRouter.use('/organisations', orgsRouter)

module.exports = mainRouter

