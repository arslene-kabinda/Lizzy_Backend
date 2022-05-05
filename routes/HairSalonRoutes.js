const express = require("express");

const router = express.Router();

const {
  getAllHairSalon,
  createHairSalon,
  getHairSalon,
  updateHairSalon,
  deleteHairSalon,
} = require("../controllers/HairSalonController");
const { protect, restrictTo } = require("../controllers/authController");

router
  .route("/")
  .get(getAllHairSalon)
  .post(protect, restrictTo(["admin", "hair_salon_owner"]), createHairSalon);
router
  .route("/:id")
  .get(getHairSalon)
  .patch(protect, restrictTo(["admin", "hair_salon_owner"]), updateHairSalon)
  .delete(protect, restrictTo(["admin", "hair_salon_owner"]), deleteHairSalon);

module.exports = router;
