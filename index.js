require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))

morgan.token('body', (req) => {
  if (req.method === 'POST')
    return JSON.stringify(req.body)
  return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}).on('error', console.log)

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(person => {
    res.json(person)
  })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  const date = new Date().toString()
  Person.estimatedDocumentCount()
    .then(response => {
      res.send(`<div>Phonebook has info for ${response} people
    <br></br>
    ${date}</div>`)})
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person)
        res.json(person)
      else
        res.status(404).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const id = req.params.id
  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new:true, runValidators:true, context: 'query', returnDocument: 'after' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const id = Math.floor(Math.random() * 1000000)
  const body = req.body
  const person = { ...body, id: id }
  Person.create(person)
    .then(response => {
      res.json(response).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)