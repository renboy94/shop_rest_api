process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");

const User = require("../models/user");
const Product = require("../models/product");

let token;

beforeAll(async done => {
  const hash = await bcrypt.hash("password", 10);
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "user@example.com",
    password: hash
  });
  await user.save();

  const response = await request(app)
    .post("/users/signin")
    .send({
      email: "user@example.com",
      password: "password"
    });
  token = response.body.token;
  done();
});

afterAll(async done => {
  try {
    await fs.emptyDir("./testUploads/testDestination");
  } catch (err) {
    console.log(err);
  }
  done();
});

describe("/orders", () => {
  describe("/orders - get all orders", () => {
    test("returns all orders", async () => {
      const response = await request(app)
        .get("/orders")
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("/orders - create order", () => {
    test("returns a new order", async () => {
      const newProduct = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "thor")
        .field("price", "12.99")
        .attach("productImage", `./testUploads/thor.jpg`);

      const newProductId = newProduct.body.createdProduct._id;
      console.log(newProduct.body.createdProduct._id);

      const newOrder = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          quantity: 1,
          productId: newProductId
        });
      console.log(newOrder.body);
      //   done();
      //   expect(newOrder.statusCode).toBe(200);
    });
  });
});
