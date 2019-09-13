process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");

const User = require("../models/user");
const Product = require("../models/product");

beforeAll(async () => {
  const hash = await bcrypt.hash("password", 10);
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "user@example.com",
    password: hash
  });
  await user.save();
});

afterAll(async () => {
  try {
    await fs.emptyDir("./testUploads/testDestination");
  } catch (err) {
    console.log(err);
  }
});

describe("/products", () => {
  //   test("it should return products", () => {});

  describe("/products - create a new product", () => {
    test("return new product created", async () => {
      const response = await request(app)
        .post("/users/signin")
        .send({
          email: "user@example.com",
          password: "password"
        });
      const token = response.body.token;
      //   const decoded = jwt.verify(token, process.env.JWT_KEY);
      //   console.log(decoded);
      const newProduct = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "thor")
        .field("price", "12.99")
        .attach("productImage", `./testUploads/thor.jpg`);
      const newProductBody = newProduct.body.createdProduct;
      //   console.log(newProductBody);
      expect(newProduct.statusCode).toBe(201);
      expect(newProductBody.name).toEqual("thor");
      expect(newProductBody.price).toEqual(12.99);
    });
  });
});
