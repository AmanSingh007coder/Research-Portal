const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173'  
}))

app.use(express.json())

// Routes
const analyzeRoute = require('./routes/analyze')
app.use('/api', analyzeRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})