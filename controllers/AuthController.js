const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const user = req.body;

  try {
    const prevUser = await User.findOne({ email: user.email });

    if (!prevUser) {
      return res.status(401).send({
        status: "error",
        message: "User with this email addess does not exist",
      });
    }

    var isPasswordValid = bcrypt.compareSync(user.password, prevUser.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ status: "error", message: "Incorrect password, try again" });
    }

    var token = jwt.sign(
      { id: prevUser._id, email: prevUser.email, role: prevUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).send({
      status: "success",
      message: "Login successful",
      user: {
        id: prevUser._id,
        email: prevUser.email,
        fullname: prevUser.fullname,
      },
      token: {
        accessToken: token,
        expiresIn: process.env.JWT_SECRET_EXPIRES,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", message: "Internal Server error" });
  }
});

authRouter.post("/register", async (req, res) => {
  const user = req.body;

  try {
    const prevUser = await User.findOne({ email: user.email });

    if (prevUser) {
      return res
        .status(400)
        .send({ status: "error", message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = new User({
      fullname: user.fullname,
      role: user.role,
      email: user.email,
      password: hashedPassword,
    });

    const response = await newUser.save();
    res
      .status(200)
      .send({ status: "success", message: "Registration successful" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});


module.exports = authRouter;
