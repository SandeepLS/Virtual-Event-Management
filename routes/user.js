const express = require("express");
const { userRegister, userLogin } = require("../controllers/user");

const router = express.Router();

// User Routes
router.post("/register", userRegister);
router.post("/login", userLogin);

module.exports = router;
