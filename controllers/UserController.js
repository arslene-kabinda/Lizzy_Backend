const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    message: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
