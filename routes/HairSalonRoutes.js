const express = require("express");

const router = express.Router();

const hairSalonController = require("../controllers/HairSalonController");

router
  .route("/")
  .get(hairSalonController.getAllHairSalon)
  .post(hairSalonController.createHairSalon);
router
  .route("/:id")
  .get(hairSalonController.getHairSalon)
  .patch(hairSalonController.updateHairSalon)
  .delete(hairSalonController.deleteHairSalon);

module.exports = router;
