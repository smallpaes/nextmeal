const express = require('express')
const bodyParser = require('body-parser')
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const cors = require('cors')
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const app = express()
const port = process.env.PORT || 3000
// enable all cors requests
app.use(cors())

// parse json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// routes
require('./routes')(app)

// handle production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/public')))
    // handle SPAs
    app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))
  }

app.listen(port, () => console.log(`App is listening on port ${port}`))

module.exports = app