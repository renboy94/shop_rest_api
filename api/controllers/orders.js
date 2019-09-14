const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .select("product quantity _id")
      .populate("product", "name");
    res.status(200).json({
      count: orders.length,
      orders: orders.map(order => {
        return {
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
          request: {
            type: "GET",
            url: "http://localhost:3010/orders/" + order._id
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

exports.orders_create_order = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    });
    order.save();
    res.status(201).json({
      message: "Order stored",
      createdOrder: {
        _id: order._id,
        product: order.product,
        quantity: order.quantity
      },
      request: {
        type: "GET",
        url: "http://localhost:3000/orders/" + order._id
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.orders_get_order = async (req, res, next) => {};

exports.orders_delete_order = async (req, res, next) => {};
