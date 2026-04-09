require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors    = require('cors')

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

app.use('/api/dashboard',        require('./routes/dashboard'))
app.use('/api/hiring-requests',  require('./routes/hiringRequests'))
app.use('/api/tasks',            require('./routes/tasks'))
app.use('/api/agenda',           require('./routes/agenda'))
app.use('/api/active-openings',  require('./routes/activeOpenings'))
app.use('/api/candidates',       require('./routes/candidates'))
app.use('/api/admissions',       require('./routes/admissions'))
app.use('/api/applications',     require('./routes/applications'))
app.use('/api/departments',      require('./routes/departments'))
app.use('/api/jd-reviews',       require('./routes/jdReviews'))
app.use('/api/interview-sessions', require('./routes/interviewSessions'))
app.use('/api/chro',             require('./routes/chro'))

app.get('/api/health', (_, res) => res.json({ ok: true }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`HIRIS API → http://localhost:${PORT}`))
