const mongoose = require("mongoose");

const user = process.argv[2];
const password = process.argv[3];

const url = `mongodb+srv://${user}:${password}@fullstackopen-exercises.i6cfv.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstackopen-exercises`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 4) {
  Person.find({}).then((result) => {
    console.log("phonebook :");
    result.forEach((person) => {
        console.log(`${person.name} --- ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const newPerson = new Person({
    name: process.argv[4],
    number: process.argv[5],
  });

  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
