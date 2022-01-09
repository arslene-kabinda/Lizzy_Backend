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

exports.getAllHairSalon = async (req, res) => {
  try {
    const features = new APIFeatures(HairSalon.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const hairSalons = await features.query;
    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: hairSalons.length,
      data: {
        hairSalons,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failled",
      message: err,
    });
  }
};
