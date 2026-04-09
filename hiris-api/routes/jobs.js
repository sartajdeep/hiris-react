/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: List job role records
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: department
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of job roles
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job role by ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job role details
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a job role record
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               department:
 *                 type: string
 *               request_id:
 *                 type: string
 *               opening_id:
 *                 type: string
 *               professor_id:
 *                 type: string
 *               hiring_manager_id:
 *                 type: string
 *               stage:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job role created
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   patch:
 *     summary: Update a job role record
 *     tags:
 *       - Jobs
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
 *               request_id:
 *                 type: string
 *               opening_id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               department:
 *                 type: string
 *               professor_id:
 *                 type: string
 *               hiring_manager_id:
 *                 type: string
 *               stage:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job role updated
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job role record
 *     tags:
 *       - Jobs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job role deleted
 */

const router = require('express').Router()
const db = require('../db/pool')

// GET /api/jobs
router.get('/', async (req, res) => {
  const { department, status } = req.query
  let q = 'SELECT * FROM job_roles WHERE 1=1'
  const params = []
  if (department) { params.push(department); q += ` AND department=$${params.length}` }
  if (status)     { params.push(status);     q += ` AND status=$${params.length}` }
  q += ' ORDER BY created_at DESC'

  const { rows } = await db.query(q, params)
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM job_roles WHERE id=$1', [req.params.id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  const {
    id = `ROLE-${Date.now()}`,
    request_id = null,
    opening_id = null,
    title,
    description,
    department,
    professor_id = null,
    hiring_manager_id = null,
    stage = 'Request',
    status = 'Draft'
  } = req.body

  if (!title) return res.status(400).json({ error: 'title is required' })

  const { rows } = await db.query(
    `INSERT INTO job_roles
      (id, request_id, opening_id, title, description, department, professor_id, hiring_manager_id, stage, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [id, request_id, opening_id, title, description, department, professor_id, hiring_manager_id, stage, status]
  )
  res.status(201).json(rows[0])
})

router.patch('/:id', async (req, res) => {
  const {
    request_id,
    opening_id,
    title,
    description,
    department,
    professor_id,
    hiring_manager_id,
    stage,
    status
  } = req.body

  await db.query(
    `UPDATE job_roles SET
      request_id = COALESCE($1, request_id),
      opening_id = COALESCE($2, opening_id),
      title = COALESCE($3, title),
      description = COALESCE($4, description),
      department = COALESCE($5, department),
      professor_id = COALESCE($6, professor_id),
      hiring_manager_id = COALESCE($7, hiring_manager_id),
      stage = COALESCE($8, stage),
      status = COALESCE($9, status)
     WHERE id=$10`,
    [request_id, opening_id, title, description, department, professor_id, hiring_manager_id, stage, status, req.params.id]
  )

  const { rows } = await db.query('SELECT * FROM job_roles WHERE id=$1', [req.params.id])
  res.json(rows[0])
})

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM job_roles WHERE id=$1', [req.params.id])
  res.json({ deleted: req.params.id })
})

module.exports = router
