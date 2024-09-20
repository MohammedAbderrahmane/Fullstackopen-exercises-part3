const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :body :status [:response-time ms]"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/persons", (request, response) => {
  response.json(persons);
});

app.get("/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id == id);
  if (!person) {
    response.status(404).end();
    return;
  }
  response.json(person);
});

app.delete("/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id != id);
  response.status(200).json({ id: id });
});

app.post("/persons", (request, response) => {
  const newPerson = request.body;

  if (!newPerson.name || !newPerson.number) {
    response
      .status(400)
      .json({ message: "name/number of the person is missing !" });
    return;
  }

  const duplicatedPerson = persons.find(
    (person) => person.name == newPerson.name
  );
  if (duplicatedPerson) {
    response.status(400).json({ message: "person already exists !" });
    return;
  }

  persons.push({
    id: Math.floor(Math.random() * 100000).toString(),
    ...newPerson,
  });
  response
    .status(201)
    .json({ id: Math.floor(Math.random() * 100000).toString(), ...newPerson });
});

app.get("/info", (request, response) => {
  const infoPage = `
<h3>the Phonebook have ${persons.length} person</h3>
<h4>${new Date().toUTCString()}</h4>
`;
  response.send(infoPage);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
