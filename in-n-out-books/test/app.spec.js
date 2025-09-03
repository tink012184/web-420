const request = require("supertest");
const app = require("../src/app");

describe("Chapter 3: API Tests", () => {
  test("Should return an array of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);

    // Check first book
    expect(res.body[0]).toEqual({
      id: 1,
      title: "Anything with Nothing",
      author: "Mercedes Lackey",
    });

    // Check second book
    expect(res.body[1]).toEqual({
      id: 2,
      title: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
    });

    // Check third book
    expect(res.body[2]).toEqual({
      id: 3,
      title: "Divergent",
      author: "Veronica Roth",
    });
  });

  test("Should return a single book (by ID)", async () => {
    const res = await request(app).get("/api/books/2");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 2,
      title: "A Court of Thorns and Roses",
      author: "Sarah J. Maas",
    });
  });

  test("Should return a 400 error if the id is not a number", async () => {
    const res = await request(app).get("/api/books/not-a-number");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "id must be a number" });
  });
});
