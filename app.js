const express = require("express");

const app = express();
const morgan = require("morgan");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const hairSalonRouter = require("./routes/HairSalonRoutes");
const beautySalonRouter = require("./routes/ BeautySalonRoutes");
const userRouter = require("./routes/UserRoutes");

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
  console.log(req.headers);
  next();
});

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      titlle: "lizzy API",
      description:
        "la plateforme  qui vous offre  le moyen d'explorer et de réserver dans un des salons de Kinshasa",
      contact: {
        name: "Arslène KABINDA",
        email: "arskabinda@gmail.com",
      },
      server: "http:127.0.0.1:4000",
    },
  },
  apis: ["app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /restaurants/all:
 *  get:
 *      description : get all restaurants figuring in the yuding platform
 *      responses :
 *        '200':
 *          description : successfull !
 */
app.use("/api/hairSalons", hairSalonRouter);
app.use("/api/beautySalons", beautySalonRouter);
app.use("/api/users", userRouter);

module.exports = app;
