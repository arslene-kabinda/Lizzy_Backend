const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "hello from the server side ", app: "lizzy" });
});
app.post("/", (req, res) => {
  res.send("you can post to this endpoint");
});

module.exports = app;
