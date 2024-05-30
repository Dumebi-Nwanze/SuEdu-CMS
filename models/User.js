const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  fullname: {
    required: true,
    type: String,
  },
  role: {
    required: true,
    type: String,
    enum: ["admin", "editor", "viewer"],
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
}, {collection: "users"});

module.exports = mongoose.model("User", usersSchema);
