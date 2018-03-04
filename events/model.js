const Sequelize = require('sequelize')
const sequelize = require('../db')

const MyEvent = sequelize.define('myEvent', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  start_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: Sequelize.DATEONLY
  },
  description: Sequelize.STRING
}, {
  tableName: 'events',
  timestamps: false,
  //timezone:+0100
})


module.exports = MyEvent
