const mongoose = require('mongoose')
const argvLen = process.argv.length

if (argvLen < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (argvLen === 4 || argvLen > 5)
	process.exit(1)

const password = process.argv[2]

const url =
	`mongodb+srv://fullstack:${password}@phonebook.jb7vwo2.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (argvLen === 3) {
	Person.find({}, 'name number').then(result => {
		console.log('phonebook:')
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
}

if (argvLen === 5) {
	const person = new Person({
  	name: process.argv[3],
  	number: Number(process.argv[4]),
	})

	person.save().then(result => {
	console.log(`added ${result.name} number ${result.number} to phonebook`)
  	mongoose.connection.close()
	})
}
