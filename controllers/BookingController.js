const moment = require("moment");

const Booking = require("../models/BookingModel");

const APIFeatures = require("../utils/apiFeatures");

const sendMail = require("../utils/Email");

exports.createBooking = async (req, res) => {
  try {
    // eslint-disable-next-line prefer-const
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

exports.getAllBooking = async (req, res) => {
  try {
    const features = new APIFeatures(Booking.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const booking = await features.query;

    res.status(200).json({
      status: "success",
      numberOfHairSalon: Booking.length,
      data: {
        booking,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.getBookingByUser = async (req, res) => {
  try {
    const booking = await Booking.find({
      user: req.decoded.id,
    }).populate("user");
    res.status(200).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
