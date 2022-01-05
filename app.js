const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("hello from the server side ");
});

module.exports = app;
