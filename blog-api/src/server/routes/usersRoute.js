const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

router.post("/auth/register", usersController.createUser);
router.post("/auth/login", authController.loginUser);
router.get("/users", authController.authUser, usersController.readAllUsers);
router.get("/user/:id", usersController.readUser);
router.put(
  "/user/update/name/:id",
  authController.authUser,
  usersController.updateName
);

module.exports = router;
