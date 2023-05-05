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
	const date = 'Phonebook has info for ' + persons.length + ' people' + "\n" + new Date().toString()
	res.write(date)
	res.end()
})