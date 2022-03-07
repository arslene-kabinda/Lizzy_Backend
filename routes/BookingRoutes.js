const express = require("express");

const router = express.Router();

// const { protect, restrictTo } = require("../controllers/authController");

const {
  createBooking,
  getAllBooking,
  getBookingByUser,
} = require("../controllers/BookingController");

// routes
router.route("/").get(getAllBooking);
router.route("/").get(getBookingByUser).post(createBooking);

module.exports = router;
