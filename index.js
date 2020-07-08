const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')


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
  Person.find({}).count().then(numberOfpersons => {
    response.json('Phonebook has the contact info of ' + numberOfpersons + ' people ' + date)
  })
})

app.get('/', (request, response) => {
  response.send(`Frontpage`)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {
  
  const body = request.body
  
  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })


  person.save().then(savedContact => {
    response.json(savedContact.toJSON())
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})