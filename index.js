const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()

// Using middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Simple todo is up and running')
})

app.listen(port, () => {
    console.log(`Simple todo is up and running on ${port}`)
})