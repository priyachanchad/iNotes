const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors')

connectToMongo();
const app = express()
const port = 5000

app.use(express.json());
app.use(cors())

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/note',require('./routes/note'))

app.listen(port, () => {
  console.log(`iNote Backend listening at http://localhost:${port}`)
})