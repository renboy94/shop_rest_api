const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_fetch = (req, res, next) => {
  User.find()
    .exec()
    .then(users => {
      res.status(200).json({
        users: users
      });
    })
    .catch(err => {
      res.status(404).json({ error: err });
    });
};

exports.user_signup = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email }).exec();
    if (user.length >= 1) {
      return res.status(409).json({
        message: "Mail exists"
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });
      await user.save();
      res.status(201).json({
        message: "User created",
        user: user
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.user_sign_in = async (req, res, next) => {};

exports.user_delete = async (req, res, next) => {};
