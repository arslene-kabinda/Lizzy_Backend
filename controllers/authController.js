const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const User = require("../models/UserModel");
const sendMail = require("../utils/Email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);

    res.status(201).json({
      status: "User created successfully",
      token,
      data: {
        user: newUser,
      },
    });
    await sendMail({
      from: "arskabinda@gmail.com",
      to: newUser.email,
      subject: " User created successfully!",
      html: "<p> You are registered as admin, you can create your haisalon and puiblish  your all activities </P>, <p> your next step is for you ceated your first haisalon </p>",
    })
      .then(() => {
        console.log("Eamil sent ");
      })
      .catch((error) => {
        console.log(error.response.body);
      });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //   1) check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "please provide email and password!",
      });
    }
    // 2) check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "failed",
        message: "incorrect mail or password",
      });
    }
    // 3) if everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: "connected to the platform",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
const SECRET_KEY = process.env.JWT_SECRET;

exports.protect = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers.authorization;
  if (!!token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  //1) verification token
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json("token is not valid");
        // eslint-disable-next-line no-else-return
      } else {
        req.decoded = decoded;

        const expiresIn = 24 * 60 * 60;

        const newToken = jwt.sign(
          {
            user: decoded.user,
          },

          SECRET_KEY,

          {
            expiresIn: expiresIn,
          }
        );
        res.header("Authorization", `Bearer ${+newToken}`);
        next();
      }
    });
  } else {
    return res.status(401).json("token is required");
  }
};

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ["admin", "hair_salon_owner ", "beauty_salon_owner"].role = "user"
    if (!roles.includes(req.body.user)) {
      return res.status(403).json({
        status: "fail",
        message: "you do not have permission to do this action",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1) get user based on POsted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "the user with that email doesn't exist",
    });
  }
  // 2) generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `forgot your password? submit a PATCH request to your new password and passwordConfirm to : ${resetURL}.\nif you didn't forget your password, please ignore this email"`;
  try {
    await sendMail({
      to: user.email,
      subject: "blablablbablla",
      html: message,
    });
    res.status(200).json({
      status: "succes",
      message: "token sent to mail",
    });
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
  } catch {
    User.passwordResetToken = undefined;
    User.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return (
      res.status(500).json,
      {
        status: "fail",
        message: "error while sending mail",
      }
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  // 1) get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    PasswordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) if token has not expired , and there is user , se the new password
  if (!user) {
    return res.status(400).json({
      status: "failed",
      message: " Token  is invalid or expired",
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.PasswordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) update changedPassword
  // 4) Log the user in , send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: "connected to the platform",
    token,
  });
};
