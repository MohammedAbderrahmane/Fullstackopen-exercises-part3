const db = require("./mongo-config");

const personSchema = new db.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => /^\d{2,3}-\d+$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    validator: function (v) {
      return /^\d{2,3}-\d+$/.test(v);
    },  
    required: true,
  },
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = db.model("Person", personSchema);

module.exports = Person;
