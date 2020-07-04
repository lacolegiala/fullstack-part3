const express = require('express')
const app = express()
const mongoose = require('mongoose')

const password = process.env.password

const url =
  `mongodb+srv://sofia:${password}@cluster0-zqlrn.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.catch(error => console.log(url, error))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)



let morgan = require('morgan')

morgan.token('body', function (req, res) {return JSON.stringify(req.body); })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
const { request, response } = require('express')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

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
    "number": "39-23-6423123",
    "id": 4
  }
]


app.get('/api/info', (request, response) => {
  const date = new Date();

  response.send(`Phonebook has info of ${persons.length} people ${date}`)
  response.json(date)
})

app.get('/', (request, response) => {
  response.send(`Frontpage`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})



app.post('/api/persons', (request, response) => {
  
  const body = request.body
  
  // const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  // personNumber = randomNumber.toString()
  
  const person = {
    name: body.name,
    number: body.number,
    id: persons.length + 1
  }

  const newArray = persons.map(person => person.name)
  

  if (!person.name || !person.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (newArray.includes(person.name)) {
    return response.status(400).json({ 
      error: 'name already exists' 
    })
  }
  persons = persons.concat(person)  


  response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const updatedContact = {
    name: body.name,
    number: body.number,
    id: parseInt(request.params.id)
  }

  persons = persons.map(person => person.id !== updatedContact.id ? person : updatedContact)
  response.json(updatedContact)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})