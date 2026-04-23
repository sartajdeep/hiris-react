require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors    = require('cors')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests from any localhost port (both HA on :5173 and Professor on :5174)
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HIRIS API',
    version: '1.0.0',
    description: 'API for HIRIS Hiring and Recruitment Information System',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
}

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
}

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options)

// Use swagger-ui-express for your app documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', require('./routes/core'))
app.use('/api', require('./routes/assistant'))
app.use('/api', require('./routes/chro'))
app.use('/api', require('./routes/candidates'))
app.use('/api/ai', require('./routes/ai'))

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a simple status object to verify the API is running.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */
app.get('/api/health', (_, res) => res.json({ ok: true }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`HIRIS API → http://localhost:${PORT}`))
