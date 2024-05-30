const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByAdmin: {
        required:false,
        type: Boolean
    }
  },
  { collection: "products" }
);

const Product  = mongoose.model("Product", productSchema);
module.exports =  Product
