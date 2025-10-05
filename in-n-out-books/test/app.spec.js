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
    const msg = (res.body && (res.body.message || res.body.error)) || res.text;
    expect(String(msg)).toMatch(/title/i);
  });

  test("Should return a 204-status code when deleting a book", async () => {
    // Seed a book, then delete it
    db.insert({ id: 999, title: "Seed Book", author: "Tester" });

    const res = await request(app).delete("/api/books/999");
    expect(res.status).toBe(204);
  });
});

describe("Chapter 5.1: API Tests", () => {
  beforeEach(() => {
    db.reset([{ id: 1, title: "Old Title", author: "Author A" }]);
  });

  test("Should update a book and return a 204-status code", async () => {
    const res = await request(app)
      .put("/api/books/1")
      .send({ title: "New Title", author: "Author A" });
    expect(res.status).toEqual(204);
  });

  test("Should return a 400-status code when using a non-numeric id", async () => {
    const res = await request(app)
      .put("/api/books/foo")
      .send({ title: "Some Title", author: "Someone" });
    expect(res.status).toEqual(400);
    expect(String(res.body.message || res.text)).toMatch(/number/i);
  });

  test("Should return a 400-status code when updating a book with a missing title", async () => {
    const res = await request(app)
      .put("/api/books/1")
      .send({ author: "Author A" });
    expect(res.status).toEqual(400);
    expect(String(res.body.message || res.text)).toMatch(/Bad Request/i);
  });
});

describe("Chapter 6: API Tests", () => {
  describe("POST /api/login", () => {
    it("should log a user in and return a 200-status with ‘Authentication successful’ message", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "user1@example.com", password: "secret123" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Authentication successful" });
    });

    it("should return a 401-status code with ‘Unauthorized’ message when logging in with incorrect credentials", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "user1@example.com", password: "wrong-password" });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Unauthorized" });
    });

    it("should return a 400-status code with ‘Bad Request’ when missing email or password", async () => {
      const res1 = await request(app)
        .post("/api/login")
        .send({ email: "user1@example.com" });
      expect(res1.status).toBe(400);
      expect(res1.body).toEqual({ message: "Bad Request" });

      const res2 = await request(app)
        .post("/api/login")
        .send({ password: "secret123" });
      expect(res2.status).toBe(400);
      expect(res2.body).toEqual({ message: "Bad Request" });
    });
  });
});

describe("Chapter 7.1: API Tests", () => {
  it("should return a 200 status with ‘Security questions successfully answered’ message", async () => {
    const res = await request(app)
      .post("/api/users/user1@example.com/verify-security-question")
      .send([
        { answer: "Fluffy" },
        { answer: "Quidditch Through the Ages" },
        { answer: "Evans" },
      ]);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Security questions successfully answered",
    });
  });

  it("should return a 400 status code with ‘Bad Request’ message when the request body fails ajv validation", async () => {
    // invalid: missing 'answer' and has an additional property
    const res = await request(app)
      .post("/api/users/user1@example.com/verify-security-question")
      .send([{ response: "Fluffy" }]);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Bad Request" });
  });

  it("should return a 401 status code with ‘Unauthorized’ message when the security questions are incorrect", async () => {
    const res = await request(app)
      .post("/api/users/user1@example.com/verify-security-question")
      .send([
        { answer: "Fluffy" },
        { answer: "Quidditch Through the Ages" },
        { answer: "Wrong Answer" }, // incorrect third answer
      ]);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });
});
