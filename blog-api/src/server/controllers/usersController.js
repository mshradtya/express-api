const User = require("../models/User");
const usersService = require("../services/usersService");
const bcrypt = require("bcrypt");
const path = require("path");

const createUser = async (req, res) => {
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

module.exports = {
  createUser,
};
