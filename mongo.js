const mongoose = require('mongoose');

const url = process.env.DATABASE_URL;

mongoose.connect(url);

const Person = mongoose.model('Person', {
  name: String,
  number: String,
});

if(process.argv.length === 4) {
  console.log(`yritetään lisätä henkilö ${process.argv[2]} numero ${process.argv[3]}`);
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  });

  person
    .save()
    .then(res => {
      console.log('person saved', res);
      mongoose.connection.close();
    })
} else {
  persons = Person
    .find({})
    .then(res => {
      console.log('puhelinluettelo:');
      res.forEach(p => console.log(`  ${p.name} ${p.number}`));
      mongoose.connection.close();
    })
}

module.exports = Person;
