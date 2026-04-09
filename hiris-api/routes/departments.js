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

const router = require('express').Router()
const db = require('../db/pool')

router.get('/',    async (req, res) => { const {rows} = await db.query('SELECT * FROM departments ORDER BY id'); res.json(rows) })
router.post('/',   async (req, res) => { await db.query('INSERT INTO departments VALUES ($1,$2)', [req.body.id, req.body.name]); res.status(201).json({ id: req.body.id }) })
router.delete('/:id', async (req, res) => { await db.query('DELETE FROM departments WHERE id=$1', [req.params.id]); res.json({ deleted: req.params.id }) })

module.exports = router
