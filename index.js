const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { Person } = require('./mongo.js');

const port = process.env.PORT || 3001;

const app = express();
app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

morgan.token('payload', req => JSON.stringify(req.body));
app.use(morgan(':method :url :payload :status :res[content-length] - :response-time ms'));

let data = {
  "persons": [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
  ]
};

const generateId = () => Math.floor(Math.random() * 1000000000);
const getIds = () => data.persons.map(p => p.id);
const getNames = () => data.persons.map(p => p.name);
const nameIsNotUnique = name => getNames().includes(name);
const addPerson = payload => {
  const newPerson = Object.assign({}, payload, {id: generateId()})
  data.persons.push(newPerson);
  return (newPerson);
};

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => res.json(persons.map(Person.format)))
    .catch(e => res.status(500).json({error: 'something went wrong'}))
});

app.post('/api/persons', (req, res) => {
  const payload = req.body;
  console.log(payload)

  if(!payload.name || payload.name.trim() === '') return res.status(400).json({error: 'name required'});
  if(!payload.number || payload.number.trim() === '') return res.status(400).json({error: 'number required'});

  console.log('lulll');

  const newPerson = new Person(payload);
  newPerson
    .save()
    .then(p => res.json(Person.format(p)))
    .catch(e => {
      console.log('dadgener')
      console.log(e.message);
      res.status(400).json({error: 'name must be unique'});
    });
});


app.get('/api/persons/:index', (req, res) => {
  const id = req.params.index;

  Person
    .findOne({ '_id': id})
    .then(p => res.json(Person.format(p)))
    .catch(e => {
      console.log(e.message)
      res.status(404).json({error: 'person not found'});
    });
});

app.delete('/api/persons/:index', (req, res) => {
  const id = req.params.index;

  Person
    .deleteOne({ '_id': id})
    .then(p => res.json(Person.format(p)))
    .catch(e => {
      console.log(e.message)
      res.status(404).json({error: 'person not found'});
    });
});

app.get('/info', (req, res) => {
  let userCount = undefined;
  const date = new Date().toString();

  Person
    .find({})
    .then(persons => userCount = persons.length)
    .catch(e => res.status(500).json({error: 'something went wrong'}))

  res.send(`
    <p>puhelinluettelossa on ${data.persons.length} henkilön tiedot</p>
    <p>${date}<p>
  `);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
