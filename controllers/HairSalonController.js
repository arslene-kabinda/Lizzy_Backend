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
    const bodies = req.body;
    bodies.owner = req.decoded.id;
    console.log("ars", req.decoded.id);
    const newHairSalon = await HairSalon.create(bodies);
    res.status(201).json({
      status: "the creation of the hairsalon is done with success",
      data: {
        newHairSalon,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllHairSalon = async (req, res) => {
  try {
    const features = new APIFeatures(
      HairSalon.find().populate("owner"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const hairSalons = await features.query;
    // const hairSalons = await HairSalon.find();
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

exports.getHairSalon = async (req, res) => {
  try {
    const hairSalon = await HairSalon.findById(req.params.id).populate("owner");
    res.status(200).json({
      status: "success",
      data: {
        hairSalon,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.updateHairSalon = async (req, res) => {
  try {
    const hairSalon = await HairSalon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        hairSalon,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.deleteHairSalon = async (req, res) => {
  try {
    const hairSalon = await HairSalon.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "hairSalon deleted successfully",
      data: {
        hairSalon,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: "invalid data sent!",
    });
  }
};
