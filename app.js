const express = require("express");

const app = express();
const morgan = require("morgan");
const hairSalonRouter = require("./routes/HairSalonRoutes");
const beautySalonRouter = require("./routes/ BeautySalonRoutes");

// middleware
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log("hello from the middleWare");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use("/api/hairSalons", hairSalonRouter);
app.use("/api/beautySalons", beautySalonRouter);

module.exports = app;
