const mongoose = require('mongoose')

// if (argvLen === 4 || argvLen > 5)
// 	process.exit(1)

const url = process.env.MONGODB_URI
	// `mongodb+srv://fullstack:${password}@phonebook.jb7vwo2.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)
	.then(result => {
		console.log("connected to mongoDB")
	})
	.catch((error) => {
		console.log("error connecting to MongoDB", error.message)
	})

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

// const Person = mongoose.model('Person', personSchema)

// if (argvLen === 3) {
// 	Person.find({}, 'name number').then(result => {
// 		console.log('phonebook:')
// 		result.forEach(person => {
// 			console.log(`${person.name} ${person.number}`)
// 		})
// 		mongoose.connection.close()
// 	})
// }

// if (argvLen === 5) {
// 	const person = new Person({
//   	name: process.argv[3],
//   	number: Number(process.argv[4]),
// 	})

// 	person.save().then(result => {
// 	console.log(`added ${result.name} number ${result.number} to phonebook`)
//   	mongoose.connection.close()
// 	})
// }

module.exports = mongoose.model('Person', personSchema)
