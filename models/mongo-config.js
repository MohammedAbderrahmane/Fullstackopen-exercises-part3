const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log(`connecting to MongoDB ...`);

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB :", error.message);
  });

module.exports = mongoose;
