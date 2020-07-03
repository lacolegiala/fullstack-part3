const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sofia:${password}@cluster0-zqlrn.mongodb.net/phonebook?retryWrites=true`


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.catch(error => console.log(error))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const newContact = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

newContact.save().then(response => {
  console.log('new contact saved!')
  mongoose.connection.close()
})