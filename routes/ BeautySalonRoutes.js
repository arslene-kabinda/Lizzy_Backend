const express = require("express");

const router = express.Router();

const beautySalonController = require("../controllers/BeautySalonControllers");

router
  .route("/")
  .get(beautySalonController.getAllBeautySalon)
  .post(beautySalonController.createBeautySalon);
router
  .route("/:id")
  .get(beautySalonController.getBeautySalon)
  .patch(beautySalonController.updateBeautySalon)
  .delete(beautySalonController.deleteBeautySalon);

module.exports = router;
