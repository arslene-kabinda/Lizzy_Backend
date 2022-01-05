const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DataBase = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DataBase, { useNewUrlParser: true }).then((connection) => {
  console.log("Database connection successful!");
});

const port = 4000;
app.listen(port, () => {
  console.log(`app is running on port ${port}...`);
});
