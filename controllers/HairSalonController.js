const HairSalon = require("../models/HairSalonModel");

const APIFeatures = require("../utils/apiFeatures");

exports.aliasTopHairSalons = (req, res, next) => {
  req.query.limit = "4";
  req.query.sort = "createdAt";
  req.query.fields = "name,ratingsAverage";
  next();
};

exports.createHairSalon = async (req, res) => {
  try {
    const Body = req.body;
    const newHairSalon = await HairSalon.create(Body);
    req.status(201).json({
      status: "the creation of the hairsalon is done with success",
      data: {
        newHairSalon,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
