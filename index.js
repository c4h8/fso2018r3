const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const port = process.env.PORT || 3001;

const app = express();
app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

morgan.token('payload', req => JSON.stringify(req.body));
app.use(morgan(':method :url :payload :status :res[content-length] - :response-time ms'));

// app.use(morgan((tokens, req, res) => 
//   [
//     tokens.method(req, res), 
//     tokens.url(req, res),
//     JSON.stringify(req.body),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms'
//   ].join(' ')
// ));

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

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// });

app.get('/api/persons', (req, res) => {
  res.json(data.persons);
});

app.post('/api/persons', (req, res) => {
  const payload = req.body;
  //console.log('payload', payload);

  if(!payload.name || !payload.number) return res.status(400).json({error: 'name and number needed'});
  if(nameIsNotUnique(payload.name)) return res.status(400).json({error: 'name must be unique'});

  const newPerson = addPerson(payload);
  res.json(newPerson);
});


app.get('/api/persons/:index', (req, res) => {
  const id = req.params.index;
  const person = data.persons.find(p => p.id == id);

  if(person) {
    res.json(person);
  } else {
    res.status(404).json({error: 'person not found'});
  }
});

app.delete('/api/persons/:index', (req, res) => {
  const id = req.params.index;
  const person = data.persons.find(p => p.id == id);

  if(person) {
    data.persons = data.persons.filter(p => p.id != id);
    res.json(person);
  } else {
    res.status(404).json({error: 'person not found'});
  }
});

app.get('/info', (req, res) => {
  const date = new Date().toString();
  res.send(`
    <p>puhelinluettelossa on ${data.persons.length} henkilön tiedot</p>
    <p>${date}<p>
  `);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
