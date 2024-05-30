const express = require("express");

const productRouter = express.Router();
const productMiddleware = require("../middlewares/productMiddleware");

const Product = require("../models/Product");

productRouter.post("/add-product", productMiddleware, async (req, res) => {
  const role = req.role;
  const ownerId = req.userId;
  const product = req.body;
  if (role !== "admin" && role !== "editor") {
    return res
      .status(403)
      .send({ status: "error", message: "User cannot perform this action" });
  }
  const newProduct = new Product({
    name: product.name,
    price: product.price,
    description: product.description,
    ownerId: ownerId,
  });
  try {
    const response = await newProduct.save();
    res
      .status(200)
      .send({ status: "success", message: "Product added successfully" });
    return;
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

productRouter.post(
  "/add-product-for-user/:userId",
  productMiddleware,
  async (req, res) => {
    const role = req.role;
    const product = req.body;
    const { userId } = req.params;
    if (role !== "admin") {
      return res
        .status(403)
        .send({ status: "error", message: "User cannot perform this action" });
    }
    const newProduct = new Product({
      name: product.name,
      price: product.price,
      description: product.description,
      ownerId: userId,
      createdByAdmin: true,
    });
    try {
      const response = await newProduct.save();
      res
        .status(200)
        .send({
          status: "success",
          message: "Product created by admin successfully",
        });
      return;
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }
);

productRouter.patch(
  "/update-product/:id",
  productMiddleware,
  async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { id } = req.params;
    const { name, price, description } = req.body;
    if (role !== "admin" && role !== "editor") {
      res.status(403).send({
        status: "error",
        message: "User does not have sufficient permissions",
      });
      return;
    }
    try {
      const foundProduct = await Product.findById(id);
      if (!foundProduct) {
        return res
          .status(404)
          .send({
            status: "error",
            message: "Product with this ID does not exist in DB",
          });
      }

      if (role === "editor" && foundProduct.ownerId.toString() !== userId) {
        res.status(401).send({
          status: "error",
          message: "User is not the creator of this product. Cannot modify",
        });
        return;
      }

      const newProduct = await Product.findByIdAndUpdate(
        id,
        { name, price, description },
        { new: true, runValidators: true }
      );
      res.status(200).send({
        status: "success",
        message: "Product Updated successfully",
        newProduct,
      });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }
);

productRouter.delete(
  "/delete-product/:id",
  productMiddleware,
  async (req, res) => {
    const role = req.role;
    const userId = req.userId;
    const { id } = req.params;
    if (role !== "admin" && role !== "editor") {
      res.status(403).send({
        status: "error",
        message: "User does not have sufficient permissions",
      });
      return;
    }
    try {
      const foundProduct = await Product.findById(id);
      if (!foundProduct) {
        return res
          .status(404)
          .send({
            status: "error",
            message: "Product with this ID does not exist in DB",
          });
      }
      if (role === "editor" && foundProduct.ownerId.toString() !== userId) {
        res.status(401).send({
          status: "error",
          message: "User is not the creator of this product. Cannot modify",
        });
        return;
      }
      await foundProduct.deleteOne();
      res.status(200).send({
        status: "success",
        message: "Product Deleted successfully",
      });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }
);

productRouter.get("/all", productMiddleware, async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send({
      status: "success",
      products,
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

productRouter.post("/get-by-name", productMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send({ status: "error", message: "Bad request" });
  }
  try {
    const products = await Product.findOne({ name: name });
    res.status(200).send({
      status: "success",
      products,
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

module.exports = productRouter;
