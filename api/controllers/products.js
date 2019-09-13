const mongoose = require("mongoose");

const Product = require("../models/product");

exports.products_get_all = async (req, res, next) => {
  try {
    const products = await Product.find().select("name price _id productImage");
    res.status(200).json({
      count: products.length,
      products: products.map(doc => {
        return {
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          _id: doc._id,
          request: {
            type: "GET",
            url: "http://localhost:3007/products/" + doc._id
          }
        };
      })
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

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

exports.products_get_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const product = await Product.findById(id).select(
      "name price _id productImage"
    );
    if (product) {
      res.status(200).json({
        product: product,
        request: {
          type: "GET",
          url: "http://localhost:3007/products/"
        }
      });
    } else {
      res.status(400).json({ message: "No valid entry found for provided ID" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
