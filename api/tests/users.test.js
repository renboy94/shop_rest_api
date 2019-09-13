const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

beforeAll(async () => {
  const hash = await bcrypt.hash("password", 10);
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "duplicate@example.com",
    password: hash
  });
  await user.save();
});

describe("/users", () => {
  describe("/users/ - get users endpoint", () => {
    test("returns an error", async () => {
      const response = await request(app).get("/userz");
      expect(response.statusCode).toBe(404);
    });

    test("returns the users", async () => {
      const response = await request(app).get("/users");
      expect(response.statusCode).toBe(200);
      expect(response.body.users).toHaveLength(1);
    });
  });

  describe("/users/signup - sign up a new user", () => {
    test("returns an error for duplicate", async () => {
      const response = await request(app)
        .post("/users/signup")
        .send({
          email: "duplicate@example.com",
          password: "password"
        });
      expect(response.statusCode).toBe(409);
    });

    test("returns the new registered user", async () => {
      const response = await request(app)
        .post("/users/signup")
        .send({
          email: "renboy@example.com",
          password: "password"
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.user.email).toEqual("renboy@example.com");
    });
  });

  describe("/users/signin - signs in a user", () => {
    test("returns an error for failed signin", async () => {
      const response = await request(app)
        .post("/users/signin")
        .send({
          email: "notexist@example.com",
          password: "password"
        });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toContain("Auth failed");
    });

    test("returns an access token", async () => {
      const response = await request(app)
        .post("/users/signin")
        .send({
          email: "duplicate@example.com",
          password: "password"
        });
      const token = response.body.token;
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      expect(response.statusCode).toBe(200);
      expect(decoded.email).toEqual("duplicate@example.com");
    });
  });

  describe("/users/:userId - deletes a user", () => {
    test("returns the deleted user", async () => {
      const response = await request(app)
        .post("/users/signin")
        .send({
          email: "duplicate@example.com",
          password: "password"
        });

      const token = response.body.token;
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      const deleteUser = await request(app)
        .delete(`/users/${decoded.userId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(deleteUser.body.message).toContain("User deleted");
    });
  });
});
