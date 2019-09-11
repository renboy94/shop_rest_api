const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.get_users = (req, res, next) => {
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
