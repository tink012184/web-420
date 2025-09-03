/**
 * Author: Melissa Lutz
 * Date: 9/3/2025
 * File Name: app.js
 * Description: Hands-On 3.1 - JSON Web Service with Jest (TDD)
 */

const express = require("express");
const books = require("../database/books");

const app = express();

// GET /api/books -> array of books
app.get("/api/books", (req, res) => {
  try {
    const all = books.find();
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/books/:id -> a single book by id
// Must 400 if id is not a number; 404 if not found
app.get("/api/books/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }

    const book = books.findOne({ id });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
