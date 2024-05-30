const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const userRouter = express.Router();
const authMiddleware= require("../middlewares/authMiddleware")

userRouter.post("/create-user",authMiddleware, async (req, res) => {
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
    res.status(200).send({
      status: "success",
      message: "User created successfully",
      login: { email: user.email, password: user.password },
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

userRouter.get("/all", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      status: "success",
      users: users.map((u) => ({
        _id: u._id,
        fullname: u.fullname,
        role: u.role,
        email: u.email,
      })),
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }

  
});


userRouter.patch("/update",authMiddleware, async (req, res) => {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res
        .status(400)
        .send({ status: "error", message: "User ID is required" });
    }
    const newData = {
        fullname: updateData.fullname,
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(id, newData, {
        new: true
      });

      if (!updatedUser) {
        return res
          .status(404)
          .send({
            status: "error",
            message: "User with this ID does not exist in DB",
          });
      }

      res
        .status(200)
        .send({
          status: "success",
          message: "User updated successfully",
          user: updatedUser,
        });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  });


userRouter.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).send({ status: "error", message: "User ID is required" });
    }
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).send({ status: "error", message: "User with this ID does not exist in DB" });
      }
  
      res.status(200).send({ status: "success", message: "User deleted successfully" });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  });

module.exports = userRouter;
