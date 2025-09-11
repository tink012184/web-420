/**
 * Author: Melissa Lutz
 * Date: 9/11/2025
 * File Name: app.js
 * Description: Hands-On 4.1: Manipulating Data in your Web Service
 */

const express = require("express");
const db = require("../database/collection");

const app = express();
app.use(express.json());

// POST /api/books -> 201 on success; 400 if title missing
app.post("/api/books", async (req, res, next) => {
  try {
    const { id, title, author } = req.body || {};
    if (!title) {
      const err = new Error("Title is required.");
      err.status = 400;
      throw err;
    }
    const created = db.insert({ id, title, author });
    return res.status(201).json(created);
  } catch (err) {
    if (!err.status) err.status = 500;
    return next(err);
  }
});

// DELETE /api/books/:id -> 204 on success (idempotent)
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    db.deleteById(req.params.id);
    return res.sendStatus(204);
  } catch (err) {
    if (!err.status) err.status = 500;
    return next(err);
  }
});

// Basic error handler (kept last)
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
