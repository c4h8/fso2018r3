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

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => res.json(persons.map(Person.format)))
    .catch(e => res.status(500).json({error: 'something went wrong'}))
});

app.post('/api/persons', (req, res) => {
  const payload = req.body;

  if(!payload.name || payload.name.trim() === '') return res.status(400).json({error: 'name required'});
  if(!payload.number || payload.number.trim() === '') return res.status(400).json({error: 'number required'});

    const newPerson = new Person(payload);
    newPerson
      .save()
      .then(p => res.json(Person.format(p)))
      .catch(e => {
        if(e.code == 11000) return res.status(400).json({error: 'name already exists'});
        res.status(400).json({error: e});
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

app.put('/api/persons/:index', (req, res) => {
  const payload = req.body;

  if(!payload.name || payload.name.trim() === '') return res.status(400).json({error: 'name required'});
  if(!payload.number || payload.number.trim() === '') return res.status(400).json({error: 'number required'});

  Person.findOneAndUpdate({ 'name': payload.name }, {number: payload.number}, { new: true })
    .then(p => res.json(Person.format(p)))
    .catch(e => {
      console.log(e.message);
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
  const date = new Date().toString();

  Person
    .find({})
    .then(persons =>
      res.send(`
        <p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
        <p>${date}<p>
      `)
    )
    .catch(e => res.status(500).json({error: 'something went wrong'}))
});

app.listen(port, () => console.log(`Server running on port ${port}`));



/*
  if (existingPerson) {
    existingPerson.number = payload.number;
    existingPerson.save()
      .then(p => res.json(Person.format(p)))
      .catch(e => {
        console.log(e.message);
        res.status(400).json({error: 'something went wrong'});
      });
  } else {
    const newPerson = new Person(payload);
    newPerson
      .save()
      .then(p => res.json(Person.format(p)))
      .catch(e => {
        console.log(e.message);
        res.status(400).json({error: 'something went wrong'});
      });
  }
*/
