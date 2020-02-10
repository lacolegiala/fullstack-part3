const express = require('express')
const app = express()

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

app.use(express.json())

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
  // person.id = persons.length + 1
  const randomNumber = Math.random() * (9999999999 - 1000000000) + 1000000000
  personNumber = randomNumber.toString()
  const body = request.body

  const person = {
    name: body.name,
    number: personNumber,
    id: persons.length + 1
  }
  
  persons = persons.concat(person)
  console.log(person)

  response.json(person)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})