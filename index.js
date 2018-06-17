const express = require('express');
const app = express();

const data = {
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

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
});

app.get('/api/persons', (req, res) => {
  res.json(data.persons);
});

app.get('/api/persons/:index', (req, res) => {
  const id = req.params.index;
  const person = data.persons.find(p => p.id == id);

  if(person) {
    res.json(person);
  } else {
    res.status(404).send('person not found');
  }
});

app.get('/info', (req, res) => {
  const date = new Date().toString();
  res.send(`
    <p>puhelinluettelossa on ${data.persons.length} henkilön tiedot</p>
    <p>${date}<p>
  `);
});

const port = 3001;
app.listen(port);
console.log(`Server running on port ${port}`);

