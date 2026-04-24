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

// Root Landing Page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>HIRIS API Status</title>
        <style>
          body { font-family: -apple-system, system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0F172A; color: white; }
          .card { background: #1E293B; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid #334155; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
          .status { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.1); color: #10B981; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 12px; text-transform: uppercase; margin-bottom: 20px; }
          h1 { margin: 0 0 10px; font-weight: 900; letter-spacing: -1px; }
          p { color: #94A3B8; margin-bottom: 30px; }
          .btn { display: inline-block; background: #28666E; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; transition: all 0.2s; }
          .btn:hover { background: #1E4D54; transform: translateY(-2px); }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="status"><span style="width:8px;height:8px;background:#10B981;border-radius:50%"></span> API is Live</div>
          <h1>HIRIS Backend</h1>
          <p>The hiring intelligence engine is running on port ${PORT}.</p>
          <a href="/api-docs" class="btn">View API Documentation</a>
        </div>
      </body>
    </html>
  `)
})

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
