const router = require('express').Router()
const db = require('../db/pool')

router.get('/',    async (req, res) => { const {rows} = await db.query('SELECT * FROM departments ORDER BY id'); res.json(rows) })
router.post('/',   async (req, res) => { await db.query('INSERT INTO departments VALUES ($1,$2)', [req.body.id, req.body.name]); res.status(201).json({ id: req.body.id }) })
router.delete('/:id', async (req, res) => { await db.query('DELETE FROM departments WHERE id=$1', [req.params.id]); res.json({ deleted: req.params.id }) })

module.exports = router
