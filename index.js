const express = require('express')
const app = express() //We create object representing express app
const persons = require('./db.json')

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