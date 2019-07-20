var app = require('express')()
,   createErrors = require('http-errors')
,   Event = require('./models/Event')
,   Category = require('./models/Category')
,   mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

app.get('/categories', async (req, res) => {
  Category.find()
  .then(categories => res.json({ result: categories.map(c => c.toJSON())}))
})

app.get('/events', (req, res, next) => {
  Event.find()
  .then(events => {
    res.json({ result: events.map(e => e.toJSON())})
  })
  .catch(next)
})

app.get('/events/:id/path', async (req, res, next) => {
  let { id } = req.params

  if (!id)
    return next(new createErrors.BadRequest())

  Paths.find({ eventId: id })
  .then(paths => {
    res.json({ result: paths.map(p => p.toJSON())})
  })
  .catch(next)
})

app.use((error, req, res, next) => {
  console.log(error.stack)
  res.status(error.status)
  res.json(error)
})
module.exports = app
