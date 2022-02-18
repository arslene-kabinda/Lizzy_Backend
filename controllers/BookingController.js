const Booking = require("./../models/BookingModel");

const apiFeatures = require("./../utils/apiFeatures");

const moment = require("moment");

const sendMail = require("../utils/Emails");

exports.createBooking = async (req, res) => {
  try {
    let currentDate = moment();
    console.log(currentDate.toString());
    const bookingDate = req.body.date;
    if (moment(bookingDate).isBefore(currentDate)) {
      res.status(400).json({
        status: "bade date ",
      });
    } else {
      const bodies = req.body;
      bodies.user = req.decoded.id;
      const newBooking = await Booking.create(bodies);
      res.status(201).json({
        status: "booking created successfully",
        data: {
          newBooking,
        },
      });
      await sendMail({
        from: "arskabinda@gmail.com",
        to: newBooking.user.email,
        subject: "you have booked successfully!",
        html: "<p>Thank you for your booking we are waiting for you!</P>",
      })
        .then(() => {
          console.log("email sent ");
        })
        .catch((error) => {
          console.error(error.response.body);
        });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      code: err.code,
      message: err.code,
    });
  }
};
