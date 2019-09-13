const mongoose = require("mongoose");

const Product = require("../models/product");

exports.products_create_product = async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });
    const newProduct = await product.save();
    if (newProduct) {
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: newProduct.name,
          price: newProduct.price,
          _id: newProduct._id,
          image: newProduct.productImage,
          request: {
            type: "POST",
            url: "http://localhost:3007/products/" + newProduct._id
          }
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};
