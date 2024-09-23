const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/Person");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :body :status [:response-time ms]"));

app.get("/persons", (request, response, next) => {
  Person.find({})
    .then((result) => {
      if (!result) {
        next({ message: "no people found" });
        return;
      }
      response.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findOne({ _id: id })
    .then((result) => {
      if (!result) {
        next({ message: "person not found" });
        return;
      }
      response.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (!result) return next({ message: "person already deleted" });
      response.json({ id: id });
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/persons", (request, response, next) => {
  const newPerson = new Person({ ...request.body });

  if (!newPerson.name || !newPerson.number) {
    next({ message: "name/number of the person is missing !" });
    return;
  }

  Person.findOne({ name: newPerson.name })
    .then((result) => {
      if (result) return next({ message: "person arleady exists" });
      newPerson
        .save()
        .then((result) => response.json(result))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

app.put("/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const person = request.body;

  console.log(person);
  if (!person.name || !person.number) {
    next({ message: "name/number of the person is missing !" });
    return;
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.get("/info", async (request, response, next) => {
  Person.countDocuments()
    .then((result) => {
      const infoPage = `
    <h3>the Phonebook have ${result} person</h3>
    <h4>${new Date().toUTCString()}</h4>
    `;
      response.send(infoPage);
    })
    .catch((error) => next({ message: error }));
});

app.use((error, request, response) => {
  response.status(400).send({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
