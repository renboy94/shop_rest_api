process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const MongoMemoryServer = require("mongodb-memory-server").default;

// const User = require("./db/models/user").User;
// const User = require("../../../db/models/user").User;

const request = require("supertest");

// const app = require("../../../app");
// const conn = require("../../../db/index");

// import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
// const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, err => {
    if (err) console.error(err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("...", () => {
  it("...", async () => {
    const User = mongoose.model("User", new mongoose.Schema({ name: String }));
    const cnt = await User.count();
    // const cnt = await User.find();
    console.log(cnt);
    // expect(cnt).toEqual(1);
  });
});

// describe("POST /", () => {
//   test("It returns an error for duplicate email", async () => {
//     const response = await request(app)
//       .post("/register")
//       .send({
//         username: "newUser",
//         password: "newPass"
//       });
//     expect(response.statusCode).toBe(400);
//     expect(response.body).toContain("Email already exists");
//     // console.log(response.body);
//   });

//   test("It registers a new user", async () => {
//     const response = await request(app)
//       .post("/register")
//       .send({
//         username: "newUser1",
//         password: "newPass1"
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.type).toBe("application/json");
//   });

//   test("It logins a user and return a token", async () => {
//     const response = await request(app)
//       .post("/login")
//       .send({
//         username: "newUser1",
//         password: "newPass1"
//       });
//     const token = response.body.token;
//     const decoded = jwt.verify(token, process.env.JWT_KEY);
//     expect(response.statusCode).toBe(200);
//     expect(decoded.username).toEqual("newUser1");
//   });

//   test("It logins a user and return a token 2", async () => {
//     const response = await request(app)
//       .post("/login")
//       .send({
//         username: "newUser1",
//         password: "newPass1"
//       });
//     const token = response.body.token;
//     const decoded = jwt.verify(token, process.env.JWT_KEY);
//     expect(response.statusCode).toBe(200);
//     expect(decoded.username).toEqual("newUser1");
//   });
// });

// describe("GET /", () => {
//   test("It should get notes", async () => {
//     // const response = await request(app).get("/notes");
//     // console.log(response);
//     const response = await request(app)
//       .post("/login")
//       .send({
//         username: "newUser1",
//         password: "newPass1"
//       });
//     const token = response.body.token;
//     console.log(response.statusCode);
//     const notes = await request(app)
//       .get("/notes")
//       .set("Authorization", `Bearer ${token}`);
//     expect(notes.statusCode).toBe(200);
//   });

//   test("It should get a single note", async () => {
//     const response = await request(app).get("/users");
//     console.log(response.body[0]._id);
//     const newNote = await request(app)
//       .post("/notes")
//       .send({
//         user: response.body[0],
//         name: "New text",
//         text: "New text body"
//       });
//     const getNote = await request(app).get(`/notes/${newNote.body._id}`);
//     expect(getNote.statusCode).toBe(200);
//     expect(getNote.body.user).toEqual(response.body[0]._id);
//   });
// });
