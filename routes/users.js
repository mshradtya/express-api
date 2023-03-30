import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async (req, res) => {
  const usersList = await User.find().select("-passwordHash");

  if (!usersList) {
    res.status(500).json({ success: false });
  }

  res.send(usersList);
});

router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res.status(500).json({ success: false });
  }

  res.send(user);
});

router.post("/", async (req, res) => {
  const userExists = User.findOne({ email: req.body.email });

  if (userExists) return res.status(404).send("the user already exists");

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) {
    return res.status(404).send("the user cannot be registered");
  }

  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("User not found");

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const secret = process.env.secret;
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token });
  } else {
    res.status(400).send("wrong password");
  }
});

router.post("/register", async (req, res) => {
  const userExists = User.findOne({ email: req.body.email });

  if (userExists) return res.status(404).send("the user already exists");

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) {
    return res.status(404).send("the user cannot be registered");
  }

  res.send(user);
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user)
        return res.status(200).json({ success: true, message: "user deleted" });
      else
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const usersCount = await User.countDocuments();

  if (!usersCount) {
    res.status(500).json({ success: false });
  }

  res.send({ count: usersCount });
});

export default router;
