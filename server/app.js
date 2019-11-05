const express = require('express')
const bodyParser = require('body-parser')
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
// enable all cors requests
app.use(cors())

// parse json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// routes
require('./routes')(app)
//cron job
require('./config/cron')

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public/'))
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

app.listen(port, () => console.log(`App is listening on port ${port}`))

module.exports = app