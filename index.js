const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')
const Op = Sequelize.Op;

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


app.listen(4001, () => console.log('Express API listening on port 4001'))
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next()
})

app.get('/events', (req, res) => {
  MyEvent.findAll({
    attributes: ['title', 'start_date', 'end_date'],
    where:{start_date: {[Op.gt]: Date.now()}}
    })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500)
      res.json({message: 'Something went wrong'})
    })
})

app.get('/events/:id', (req, res) => {
  MyEvent.findById(req.params.id)
    .then(result => {
//      console.log(new Date().toISOString().slice(0,10));
      if (result) {
        res.json(result)
      } else {
        res.status(404)
        res.json({ message: 'Not Found' })
      }
    })
    .catch(err => {
      res.status(500)
      res.json({ message: 'There was an error' })
    })
})

const endDateProblem = (res) => {
  res.status(500)
  res.json({ message: "Problem, ending date cannot happen before the starting date!!"})
}

const cannotGoBackInTime = (res) => {
  res.status(501)
  res.json({ message: "Cannot go back in time!!"})
}

app.post('/events', (req, res) => {
  const myEvent = req.body
  //console.log(Date.now())
  if (myEvent.end_date<myEvent.start_date){
    endDateProblem(res)
  }
  else if (myEvent.start_date< new Date().toISOString().slice(0,10)) {
    cannotGoBackInTime(res)
  }
  else {
    MyEvent.create(myEvent)
      .then(entity => {
        res.status(201)
        res.json(entity)
      })
      .catch(err => {
        res.status(422)
        res.json({ message: err.message })
      })
  }
})

const updateOrPatch = (req, res) => {
  //const productId = Number(req.params.id)
  const updates = req.body

  // find the product in the DB
  MyEvent.findById(req.params.id)
    .then(entity => {
      // change the product and store in DB
      const eEnd = entity.end_date
      const eStart = entity.start_date
      const uStart = updates.start_date
      const uEnd = updates.end_date

      if (uStart && uEnd) {
        if (uStart>uEnd) {
          endDateProblem(res)
        }
        else if (uStart < new Date().toISOString().slice(0,10)) {
          cannotGoBackInTime(res)
        }
        else{
          return entity.update(updates)
        }
      }

      if (uStart && !uEnd) {
        if (uStart>uEnd) {
          endDateProblem(res)
        }
        else if (uStart < new Date().toISOString().slice(0,10)) {
          cannotGoBackInTime(res)
        }
        else{
          return entity.update(updates)
        }
      }

      if (!uStart && uEnd) {
        if (eStart>uEnd) {
          endDateProblem(res)
        }
        else if (uEnd < new Date().toISOString().slice(0,10)) {
          cannotGoBackInTime(res)
        }
        else{
          return entity.update(updates)
        }
      }

      if (!uStart && !uEnd) {
        return entity.update(updates)
      }
    })
    .then(final => {
      // respond with the changed product and status code 200 OK
      res.send(final)
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
}

app.put('/events/:id', updateOrPatch)
app.patch('/events/:id', updateOrPatch)
