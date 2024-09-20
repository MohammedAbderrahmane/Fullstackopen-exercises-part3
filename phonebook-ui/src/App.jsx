import { useEffect, useState } from "react";
import axios from "axios";
import service from "./services";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const getPersons = () => {
    service.get().then((data) => {
      setPersons(data);
    });
  };

  const addPerson = (event) => {
    setErrorMessage("Adding Person ...");
    event.preventDefault();
    const personObject = { name: newName, number: newNumber };

    const dublicatedPerson = persons.find((person) => person.name == newName);
    if (dublicatedPerson != null) {
      const canContinue = window.confirm(
        `Do you want to replace ${newName}'s number`
      );
      if (!canContinue) return;

      service
        .update(personObject, dublicatedPerson.id)
        .then((data) => {
          const tmpPersons = [...persons];
          tmpPersons[tmpPersons.indexOf(dublicatedPerson)] = data;
          setPersons(tmpPersons);
          setNewName("");
          setNewNumber("");
          setErrorMessage({
            status: "success",
            message: `${newName}'s number was updated`,
          });
          setTimeout(() => {
            setErrorMessage(null);
          }, 2500);
        })
        .catch((error) => {
          setErrorMessage({
            status: "fail",
            message: `failed to update ${newName}'s number`,
          });
          setTimeout(() => {
            setErrorMessage(null);
          }, 2500);
        });
      return;
    }

    service
      .add(personObject)
      .then((data) => {
        setPersons(persons.concat(data));
        setNewName("");
        setNewNumber("");
        setErrorMessage({
          status: "success",
          message: `${newName} was added to the phonebook`,
        });
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      })
      .catch((error) => {
        setErrorMessage({
          status: "fail",
          message: `failed to add ${newName}`,
        });
        setTimeout(() => {
          setErrorMessage(null);
        }, 2500);
      });
  };

  const deletePerson = (person) => () => {
    setErrorMessage(`Deleting ${person.name} ...`);
    const canContinue = window.confirm(`Do you want to remove ${person.name}`);
    if (!canContinue) return;

    service
      .remove(person.id)
      .then((data) => {
        console.log(data);
        setPersons(persons.filter((item) => item.id != data.id));
        setErrorMessage({
          status: "success",
          message: `${person.name} was deleted`,
        });
        setTimeout(() => {
          setErrorMessage(null);
        }, 2500);
      })
      .catch((error) => {
        setErrorMessage({
          status: "fail",
          message: `failed to delete ${person.name}`,
        });
        setTimeout(() => {
          setErrorMessage(null);
        }, 2500);
      });
  };

  useEffect(getPersons, []);

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Phonebook</h2>
      <Filter
        persons={persons}
        filteredPersons={filteredPersons}
        setFilteredPersons={setFilteredPersons}
      />

      <NewPerson
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />

      <PersonsList persons={persons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;

const Filter = ({ persons, filteredPersons, setFilteredPersons }) => {
  return (
    <div>
      <h3>filter name : </h3>
      <input
        onChange={(event) => {
          const a = persons.filter((person) =>
            person.name.toLowerCase().includes(event.target.value.toLowerCase())
          );
          setFilteredPersons(a);
        }}
      />
      {filteredPersons.map((person) => (
        <p>
          {person.name} - {person.number}
        </p>
      ))}
    </div>
  );
};

const NewPerson = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  addPerson,
}) => {
  return (
    <>
      <h3>Add a new</h3>

      <form>
        <div>
          name:{" "}
          <input
            value={newName}
            onChange={(event) => {
              setNewName(event.target.value);
            }}
          />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(event) => {
              setNewNumber(event.target.value);
            }}
          />
        </div>
        <div>
          <button type="submit" onClick={addPerson}>
            add
          </button>
        </div>
      </form>
    </>
  );
};

const PersonsList = ({ persons, deletePerson }) => {
  return (
    <>
      <h3>Numbers</h3>
      {persons.map((person) => (
        <div>
          <span>
            {person.name} - {person.number}
          </span>
          <button onClick={deletePerson(person)}>delete</button>
        </div>
      ))}
    </>
  );
};

const Notification = ({ message }) => {
  if (message == null) {
    return <></>;
  }

  return (
    <div
      className={
        message.status == "success" ? "successNotification" : "failNotification"
      }
    >
      {message.message}
    </div>
  );
};
