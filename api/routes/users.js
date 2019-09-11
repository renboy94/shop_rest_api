const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

router.get("/", UserController.user_fetch);

router.post("/signup", UserController.user_signup);

router.post("/signin", UserController.user_signin);

router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
