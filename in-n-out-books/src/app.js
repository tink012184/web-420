/**
 * Author: Melissa Lutz
 * Date: 9/19/2025
 * File Name: app.js
 * Description: Hands-On 4.1: Manipulating Data in your Web Service
 */

const express = require("express");
const books = require("../database/books.js");

const app = express();
app.use(express.json());

// PUT /api/books/:id -> 204 on success
app.put("/api/books/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      const err = new Error("Input must be a number");
      err.status = 400;
      return next(err);
    }

    const { title, author } = req.body || {};
    if (!title) {
      const err = new Error("Bad Request");
      err.status = 400;
      return next(err);
    }

    const ok = books.updateById(id, { title, author });
    // (Optional) If not found, you could return 404; spec doesn't require it.
    if (!ok) return res.status(204).end(); // id not found but treat as idempotent

    return res.status(204).end();
  } catch (err) {
    err.status = err.status || 500;
    return next(err);
  }
});

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

module.exports = app;

// Allow running locally for manual testing
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
