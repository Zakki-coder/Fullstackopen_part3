const express = require('express')
const app = express() //We create object representing express app
const morgan = require('morgan')
// const cors = require('cors')
const Person = require('./models/person')

// let persons = [
//     { 
//       "name": "Arto Hellas", 
//       "number": "040-123456",
//       "id": 1
//     },
//     { 
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523",
//       "id": 2
//     },
//     { 
//       "name": "Dan Abramov", 
//       "number": "12-43-234345",
//       "id": 3
//     },
//     { 
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122",
//       "id": 4
//     }
//   ]


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
	Person.find({}).then(person => {
		res.json(person)
	})
})

app.get('/info', (req, res) => {
	const date = new Date().toString()
	const personN = Person.estimatedDocumentCount()
	personN.then(response => {
		res.send(`<div>Phonebook has info for ${response} people
		<br></br>
		${date}</div>`)})
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	Person.findById(id)
		.then(person => {
			res.json(person)
		})
		.catch(error => {
			res.status(404).end()
		})
	// if (person)
	// 	res.json(person)
	// else
		// res.status(404).end()
})

app.put('/api/persons/:id', (req, res) => {
	const newBody = req.body
	const id = req.params.id
	// persons = persons.filter(person => person.id !== id)
	Person.findByIdAndUpdate(id, newBody, {returnDocument: 'after'})
	.then(person => {
		console.log("lol", JSON.stringify(person))
		return res.json(person)
	})
	.catch(error => {
		console.log("Hiiteen")
		console.log(error)
		res.status(404).end()
	})
	// newBody.id = id
	// persons = persons.concat(newBody)
	// return res.json(newBody)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = req.params.id
	Person.findByIdAndRemove(id)
		.then(response => {
			res.status(200).end()
		})
		.catch(error => {
			res.status(404).end()
		})
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
	// Person.find( {name: body.name} )
	// 	.then(person => {
	// 		console.log(person)
	// 		res.status(404).json({
	// 			error: 'name must be unique'
	// 		}).end()
	// 	})
	// if (persons.some(person => person.name === body.name))
	// 	return res.status(404).json({
	// 		error: 'name must be unique'
		// })
	return null
}

app.post('/api/persons', (req, res) => {
	const id = Math.floor(Math.random() * 1000000)
	const body = req.body
	const validate = validateBody(body, res)
	if (validate)
		return validate
	const person = {...body, id: id}
	console.log("NAME", person.name)
	Person.findOne( {name: person.name} )
	.then(lol => {
		console.log(lol)
		if (lol !== null) {
		res.status(404).json({
			error: 'name must be unique'
			}).end()
		}
		else {
		Person.create(person)
			.then(response => {
				console.log("Added new to db")
				res.json(response).end()
			})
			.catch(error => {
				console.log("Failed miserably")
				console.log(error)
			})
		}
		})
	})
	// persons = persons.concat(person)
	// Person.create(person)
	// 	.then(response => {
	// 		console.log("Added new to db")
	// 		res.json(response)
	// 	})
	// 	.catch(error => {
	// 		console.log("Failed miserably")
	// 		console.log(error)
	// 	})
	// return res.json(person)