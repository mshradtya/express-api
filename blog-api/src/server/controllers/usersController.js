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

const readUser = async (req, res) => {
  try {
    const userDetail = await usersService.readUser(req.params.id);
    if (userDetail === null) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: `User does not exist.` });
    }
    return res
      .status(200)
      .json({ status: 200, success: true, user: userDetail });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ status: 400, success: false, message: `Invalid user ID.` });
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `${error.message}`,
      });
    }
  }
};

const updateName = async (req, res) => {
  try {
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length !== 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `firstName, and lastName is required.`,
        });
      }
      if (
        Object.keys(req.body).includes("firstName") &&
        Object.keys(req.body).includes("lastName")
      ) {
        const nameUpdate = await usersService.updateName(
          req.params.id,
          req.body.firstName,
          req.body.lastName
        );
        if (!nameUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Your name has been updated`,
          user: nameUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `firstName, and lastName is required.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${error.message}`,
    });
  }
};

const updateEmail = async (req, res) => {
  try {
    if (req.params.id === res.body._id.toString()) {
      if (Object.keys(req.body).length !== 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `email and password is required to change the email.`,
        });
      }
      if (
        Object.keys(req.body).includes("email") &&
        Object.keys(req.body).includes("password")
      ) {
        if (!req.body.password) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `password cannot be blank.`,
          });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          res.body.account.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
            status: 401,
            success: false,
            messge: `password is not correct.`,
          });
        }
        const emailUpdate = await usersService.updateEmail(
          req.params.id,
          req.body.email
        );
        if (!emailUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Your email has been updated.`,
          user: emailUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Please provide a valid email and password to update your email.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You do not have sufficient privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${error.message}`,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    if (res.body.account.role === "Superuser") {
      if (Object.keys(req.body).length !== 2) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `role and password is required to change the role.`,
        });
      }
      if (
        Object.keys(req.body).includes("role") &&
        Object.keys(req.body).includes("password")
      ) {
        if (!req.body.password) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: `password cannot be blank.`,
          });
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          res.body.account.password
        );
        if (!passwordIsValid) {
          return res.status(401).json({
            status: 401,
            success: false,
            messge: `password is not correct.`,
          });
        }
        const roleUpdate = await usersService.updateRole(
          req.params.id,
          req.body.role
        );
        if (!roleUpdate) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: `User does not exist.`,
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: `The user's role has been updated.`,
          user: roleUpdate,
        });
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: `Please provide a valid role and password to update the role.`,
        });
      }
    } else {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `You must have a superuser privilege to perform this operation.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  createUser,
  readAllUsers,
  readUser,
  updateName,
  updateEmail,
  updateRole,
};
