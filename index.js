const express = require('express')
const app = express() //We create object representing express app
const morgan = require('morgan')
const util = require('util')
let persons = require('./db.json') //TODO How to update the json file?

morgan.token('body', (req, res) => {
	if (req.method === 'POST')
		return JSON.stringify(req.body)
	return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

const PORT = 3001
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

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)
})

app.post('/api/persons', (req, res) => {
	const id = Math.floor(Math.random() * 1000000)
	const body = req.body
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
	const person = {...body, id: id}
	persons = persons.concat(person)
	return res.json(person)
})