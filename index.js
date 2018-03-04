const express = require('express')
const app = express()

var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')

const MyEvent = sequelize.define('myEvent', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  start_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  end_date: {
    type: Sequelize.DATE
  },
  description: Sequelize.STRING
}, {
  tableName: 'events',
  timestamps: false,
  //timezone:+0100
})


app.listen(4001, () => console.log('Express API listening on port 4001'))
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next()
})

MyEvent.findById(1).then(myEvent => console.log(JSON.stringify(myEvent)))
