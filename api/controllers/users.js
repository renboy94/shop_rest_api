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

exports.user_signin = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email }).exec();
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    const result = await bcrypt.compare(req.body.password, user[0].password);
    if (result) {
      const token = jwt.sign(
        {
          email: user[0].email,
          userId: user[0]._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        }
      );
      return res.status(200).json({
        message: "Auth successful",
        token: token
      });
    }
    res.status(401).json({
      message: "Auth failed"
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.user_delete = async (req, res, next) => {
  try {
    const result = await User.remove({
      _id: req.params.userId
    }).exec();
    res.status(200).json({
      message: "User deleted",
      user: result
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};
