const request = require("supertest");
const app = require("../src/app");
const db = require("../database/collection");

describe("Chapter 4.1: API Tests", () => {
  beforeEach(() => {
    db.reset([]); // fresh DB for each test
  });

  test("Should return a 201-status code when adding a new book", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({ id: 101, title: "Clean Code", author: "Robert C. Martin" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 101, title: "Clean Code" });
  });

  test("Should return a 400-status code when adding a new book with missing title", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({ id: 102, author: "Unknown" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  test("Should return a 204-status code when deleting a book", async () => {
    // Seed a book, then delete it
    db.insert({ id: 999, title: "Seed Book", author: "Tester" });

    const res = await request(app).delete("/api/books/999");
    expect(res.status).toBe(204);
  });
});
