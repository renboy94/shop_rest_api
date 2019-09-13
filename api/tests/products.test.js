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

describe("/products", () => {
  describe("/producrs - get all products", () => {
    test("returns all products", async () => {
      const newProduct = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "thor")
        .field("price", "12.99")
        .attach("productImage", `./testUploads/thor.jpg`);
      const response = await request(app).get("/products");
      //   console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.count).toEqual(1);
    });
  });

  describe("/products - create a new product", () => {
    test("return new product created", async () => {
      const newProduct = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "thor")
        .field("price", "12.99")
        .attach("productImage", `./testUploads/thor.jpg`);
      const newProductBody = newProduct.body.createdProduct;
      expect(newProduct.statusCode).toBe(201);
      expect(newProductBody.name).toEqual("thor");
      expect(newProductBody.price).toEqual(12.99);
    });
  });

  describe("/products - get single product", () => {
    test("returns a single products", async () => {
      const newProduct = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "thor")
        .field("price", "12.99")
        .attach("productImage", `./testUploads/thor.jpg`);
      const newProductBody = newProduct.body.createdProduct;
      const response = await request(app).get(
        "/products/" + newProductBody._id
      );
      expect(response.statusCode).toBe(200);
      expect(newProductBody.name).toEqual("thor");
      expect(newProductBody.price).toEqual(12.99);
    });
  });

  describe("/products - update a product", () => {});

  describe("/products - delete a product", () => {});
});
