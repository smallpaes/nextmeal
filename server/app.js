const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
const db = require('./models')
const Subscription = db.Subscription

// enable all cors requests
app.use(cors())
// parse json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// routes
require('./routes')(app)

app.listen(port, () => console.log(`App is listening on port ${port}`))

async function addTest(){
    const subscription = await Subscription.create({UserId:1})
}

addTest()
module.exports = app