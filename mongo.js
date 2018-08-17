const mongoose = require('mongoose');

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config();
}

const url = process.env.DATABASE_URL;

mongoose.connect(url);

const Person = mongoose.model('Person', {
  name: String,
  number: String,
});

const formatPerson = () => [];

Person.format = person => ({
  name: person.name,
  number: person.number,
  id: person._id
});

const dude = Person.find({}).then(persons => {
  console.log('FOMRMAT LIST OF PERSONS (DEFAULT)');
  console.log(persons.map(Person.format));
  console.log('FOMRMAT A SINGLE PERSON');
  console.log(Person.format(persons[0]));
  });

// mongoose.connection.close();

// if(process.argv.length === 4) {
//   console.log(`yritetään lisätä henkilö ${process.argv[2]} numero ${process.argv[3]}`);
//   const person = new Person({
//     name: process.argv[2],
//     number: process.argv[3]
//   });

//   person
//     .save()
//     .then(res => {
//       console.log('person saved', res);
//       mongoose.connection.close();
//     })
// } else {
//   persons = Person
//     .find({})
//     .then(res => {
//       console.log('puhelinluettelo:');
//       res.forEach(p => console.log(`  ${p.name} ${p.number}`));
//       mongoose.connection.close();
//     })
// }

module.exports = {Person, formatPerson};
