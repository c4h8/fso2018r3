const express = require('express');
const app = express();

const persons = {
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
  res.json(persons);
});

app.get('/info', (req, res) => {
  const date = new Date().toString();
  res.send(`
    <p>puhelinluettelossa on ${persons.persons.length} henkilön tiedot</p>
    <p>${date}<p>
  `);
});

const port = 3001;
app.listen(port);
console.log(`Server running on port ${port}`);

