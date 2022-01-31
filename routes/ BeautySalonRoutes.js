const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const beautySalonController = require("../controllers/BeautySalonControllers");

router
  .route("/")
  .get(authController.protect, beautySalonController.getAllBeautySalon)
  .post(beautySalonController.createBeautySalon);
router
  .route("/:id")
  .get(beautySalonController.getBeautySalon)
  .patch(beautySalonController.updateBeautySalon)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "beauty_salon_owner"),
    beautySalonController.deleteBeautySalon
  );

module.exports = router;
