const express = require('express')
const app = express() //We create object representing express app
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]


app.use(express.static('build'))
// app.use(cors())

morgan.token('body', (req, res) => {
	if (req.method === 'POST')
		return JSON.stringify(req.body)
	return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/info', (req, res) => {
	const date = new Date().toString()
	res.send(`<div>Phonebook has info for ${persons.length} people
	<br></br>
	${date}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)
	if (person)
		res.json(person)
	else
		res.status(404).end()
})

app.put('/api/persons/:id', (req, res) => {
	const newBody = req.body
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)
	newBody.id = id
	persons = persons.concat(newBody)
	return res.json(newBody)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	console.log('Before', persons)
	persons = persons.filter(person => person.id !== id)
	console.log('After', persons)
	return res.status(200).end()
})

const validateBody = (body, res) => {
	if (!body.name)
		return res.status(404).json({
			error: 'name missing'
		})
	if (!body.number)
		return res.status(404).json({
			error: 'number missing'
		})
	if (persons.some(person => person.name === body.name))
		return res.status(404).json({
			error: 'name must be unique'
		})
	return null
}

app.post('/api/persons', (req, res) => {
	const id = Math.floor(Math.random() * 1000000)
	const body = req.body
	const validate = validateBody(body, res)
	if (validate)
		return validate
	const person = {...body, id: id}
	persons = persons.concat(person)
	return res.json(person)
})