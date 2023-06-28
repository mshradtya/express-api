const User = require("../models/User");
const usersService = require("../services/usersService");
const bcrypt = require("bcrypt");
const path = require("path");

const createUser = async (req, res) => {
  if (
    !(
      Object.keys(req.body).includes("firstName") &&
      Object.keys(req.body).includes("lastName") &&
      Object.keys(req.body).includes("email") &&
      Object.keys(req.body).includes("password") &&
      Object.keys(req.body).includes("confirmPassword")
    )
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message:
        "firstName, lastName, email, password, and confirmPassword is required.",
    });
  }

  if (Object.keys(req.body).length !== 5) {
    return res.status(400).json({
      status: 400,
      success: false,
      message:
        "firstName, lastName, email, password, and confirmPassword is required.",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "password and confirmPassword does not match.",
    });
  }

  try {
    const user = await usersService.createUser(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      "",
      "",
      ""
    );
    return res.status(201).json({ status: 201, success: true, user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 400, success: false, message: error.message });
  }
};

const readAllUsers = async (req, res) => {
  if (
    res.body.account.role === "Superuser" ||
    res.body.account.role === "Admin" ||
    res.body.account.role === "Staff"
  ) {
    const allUsers = await usersService.readAllUsers();
    if (allUsers.length === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: `There are no users.`,
      });
    }
    return res
      .status(200)
      .json({ status: 200, success: true, users: allUsers });
  } else {
    return res.status(403).json({
      status: 403,
      success: false,
      message: `You must have either a Superuser, Admin, or Staff privilege to perform this operation.`,
    });
  }
};

module.exports = {
  createUser,
  readAllUsers,
};
