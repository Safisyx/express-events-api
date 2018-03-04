const Router = require('express').Router
const MyEvent = require('./model')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const router = new Router()


router.get('/events', (req, res) => {
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

router.get('/events/:id', (req, res) => {
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

router.post('/events', (req, res) => {
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

router.put('/events/:id', updateOrPatch)
router.patch('/events/:id', updateOrPatch)


router.delete('/events/:id', (req, res) => {
  MyEvent.findById(req.params.id)
    .then(entity => {
        return entity.destroy()
    })
    .then(_ => {
      res.send({
        message: 'The event was deleted succesfully'
      })
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
})



module.exports = router
