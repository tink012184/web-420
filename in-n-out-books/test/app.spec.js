const request = require("supertest");
const app = require("../src/app.js");
const books = require("../database/books.js");

describe("Chapter 5: API Tests", () => {
  beforeEach(() => {
    books._reset();
  });

  test("Should update a book and return a 204-status code.", async () => {
    const res = await request(app)
      .put("/api/books/1")
      .send({ title: "Dune (Revised)", author: "Frank Herbert" });
    expect(res.status).toEqual(204);

    // Optional: verify the update really happened
    const updated = books.findById(1);
    expect(updated.title).toBe("Dune (Revised)");
    expect(updated.author).toBe("Frank Herbert");
  });

  test("Should return a 400-status code when using a non-numeric id.", async () => {
    const res = await request(app)
      .put("/api/books/foo")
      .send({ title: "Anything", author: "Anyone" });
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ error: "Input must be a number" });
  });

  test("Should return a 400-status code when updating a book with a missing title.", async () => {
    const res = await request(app)
      .put("/api/books/1")
      .send({ author: "Frank Herbert" }); // no title
    expect(res.status).toEqual(400);
    expect(res.body).toEqual({ error: "Bad Request" });
  });
});
