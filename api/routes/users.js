const express = require("express");
const router = express.Router();

const User = require("../models/user");
const UserController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

router.get("/", UserController.get_users);

module.exports = router;
