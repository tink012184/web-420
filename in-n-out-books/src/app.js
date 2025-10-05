/**
 * Author: Melissa Lutz
 * Date: 8/28/2025
 * File Name: app.js
 * Description: Express app for the In-N-Out-Books project. Provides a landing page, 404/500 middleware, and exports the app for use by server.js and tests.
 */

const express = require("express");
const path = require("path");
const db = require("../database/collection"); // shared in-memory DB for tests
require("../database/books"); // seeds initial data
const usersDb = require("../database/users"); // <-- mock users
const bcrypt = require("bcryptjs"); // for password hashing

// Create the Express app

const app = express();

// Basic parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// POST /api/books — create a book
app.post("/api/books", async (req, res, next) => {
  try {
    const { id, title, author } = req.body || {};
    if (!title || String(title).trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }
    const newBook = { id, title, author };
    const created = db.insert(newBook);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/books/:id — delete a book
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    db.deleteById(id); // whether or not it existed, respond 204 per assignment
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
});

// PUT /api/books/:id — update a book
app.put("/api/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Input must be a number" });
    }
    const { title, author } = req.body || {};
    if (!title || String(title).trim() === "") {
      return res.status(400).json({ message: "Bad Request" });
    }
    // naive replace: delete old, insert new
    const book = { id: Number(id), title, author };
    const db = require("../database/collection");
    db.deleteById(id);
    db.insert(book);
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
});

/* ========================
 *  AUTH ROUTE (Chapter 6.1)
 * ======================== */

/**
 * POST /api/login
 * Body: { email, password }
 * Success: 200 { message: "Authentication successful" }
 * Missing email or password: 400 { message: "Bad Request" }
 * Invalid credentials: 401 { message: "Unauthorized" }
 */
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const user = usersDb.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const ok = bcrypt.compareSync(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ message: "Authentication successful" });
  } catch (err) {
    return next(err);
  }
});

// Root route — fully designed HTML landing page
app.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>In-N-Out-Books</title>
    <link rel="icon" type="image/png" href="/images/inAndOutLogoWhite.png">
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
<header class="site-header container" role="banner">
  <a class="brand" href="/">
    <img src="/images/inAndOutLogoWhite.png" alt="In-N-Out Books Logo" class="logo">
    <span>In-N-Out-Books</span>
  </a>

      <nav aria-label="Primary">
        <a href="#intro">Introduction</a>
        <a href="#top-selling">Top Selling</a>
        <a href="#hours">Hours</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main id="content" class="container" role="main">
      <!-- Introduction paragraph -->
      <section id="intro" class="hero" aria-labelledby="intro-heading">
        <h1 id="intro-heading">Welcome to In-N-Out-Books</h1>
        <p>
          In-N-Out-Books helps you manage your personal library, track your
          reading progress, and discover popular titles. Whether you’re an avid
          reader or coordinating a book club, our simple tools and API-first
          design keep your collection organized and easy to share.
        </p>
      </section>

      <div class="grid" style="margin-top: 1.25rem">
        <article
          id="top-selling"
          class="card"
          aria-labelledby="top-selling-heading"
        >
          <h2 id="top-selling-heading">Top Selling Books</h2>
          <p class="muted">A snapshot of what readers are loving right now.</p>

          <section class="books" aria-label="Top selling titles">
            <article class="book">
              <figure>
                <img
                  src="/images/CoT.jpg"
                  alt="Book cover for A Court of Thorns and Roses"
                />
                <figcaption class="sr-only">
                  A Court of Thorns and Roses cover
                </figcaption>
              </figure>
              <h3>A Court of Thorns and Roses</h3>
              <p class="muted">Sarah J. Maas</p>
              <span class="badge" aria-label="Bestseller badge"
                >Bestseller</span
              >
            </article>

            <article class="book">
              <figure>
                <img
                  src="/images/anythingNothing.jpg"
                  alt="Book cover for Anything with Nothing"
                />
                <figcaption class="sr-only">
                  Anything with Nothing cover
                </figcaption>
              </figure>
              <h3>Anything with Nothing</h3>
              <p class="muted">Mercedes Lackey</p>
              <span class="badge">Staff Pick</span>
            </article>

            <article class="book">
              <figure>
                <img
                  src="/images/divergent.jpg"
                  alt="Book cover for Divergent"
                />
                <figcaption class="sr-only">Divergent cover</figcaption>
              </figure>
              <h3>Divergent</h3>
              <p class="muted">Veronica Roth</p>
              <span class="badge">Trending</span>
            </article>
          </section>
        </article>

        <aside class="card" aria-labelledby="info-heading">
          <h2 id="info-heading">Store Info</h2>

          <!-- Hours of operation -->
          <section
            id="hours"
            aria-labelledby="hours-heading"
            style="margin-bottom: 1rem"
          >
            <h3 id="hours-heading">Hours of Operation</h3>
            <table aria-describedby="hours-note">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Open</th>
                  <th>Close</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monday–Friday</td>
                  <td><time datetime="09:00">9:00 AM</time></td>
                  <td><time datetime="18:00">6:00 PM</time></td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td><time datetime="10:00">10:00 AM</time></td>
                  <td><time datetime="16:00">4:00 PM</time></td>
                </tr>
                <tr>
                  <td>Sunday</td>
                  <td colspan="2">Closed</td>
                </tr>
              </tbody>
            </table>
            <p id="hours-note" class="sr-only">
              Hours are shown in local time.
            </p>
          </section>

          <!-- Contact information -->
          <section id="contact" aria-labelledby="contact-heading">
            <h3 id="contact-heading">Contact Us</h3>
            <address>
              In-N-Out-Books<br />
              123 Library Lane, Booktown, TX 75000<br />
              <a href="tel:+19725551234">+1 (972) 555-1234</a><br />
              <a href="mailto:hello@innoutbooks.example"
                >hello@innoutbooks.example</a
              >
            </address>
            <p style="margin-top: 0.75rem">
              <a class="cta" href="mailto:hello@innoutbooks.example"
                >Email Us</a
              >
            </p>
          </section>
        </aside>
      </div>
    </main>

    <footer class="site-footer container" role="contentinfo">
      © ${new Date().getFullYear()} In-N-Out-Books • Built with Express
    </footer>
  </body>
</html>
`;
  res.type("html").send(html);
});

// --- Chapter 7.1: Verify Security Questions ---
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
const secQSchema = {
  type: "array",
  items: {
    type: "object",
    properties: { answer: { type: "string" } },
    required: ["answer"],
    additionalProperties: false,
  },
};
const validateSecQ = ajv.compile(secQSchema);
app.post("/api/users/:email/verify-security-question", (req, res, next) => {
  try {
    if (!validateSecQ(req.body)) {
      const err = new Error("Bad Request");
      err.status = 400;
      return next(err);
    }
    const email = String(req.params.email || "")
      .trim()
      .toLowerCase();
    const user = usersDb.findByEmail(email);
    if (!user || !Array.isArray(user.securityQuestions)) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }
    const submitted = req.body;
    if (submitted.length !== user.securityQuestions.length) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }
    const ok = submitted.every((item, i) => {
      const a = String(item.answer).trim().toLowerCase();
      const b = String(user.securityQuestions[i].answer).trim().toLowerCase();
      return a == b;
    });
    if (!ok) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }
    return res
      .status(200)
      .json({ message: "Security questions successfully answered" });
  } catch (err) {
    return next(err);
  }
});

// 404 middleware — after all routes
app.use((req, res) => {
  res
    .status(404)
    .type("text")
    .send("404 Not Found — The resource you requested does not exist.");
});

// 500 error-handling middleware
app.use((err, req, res, next) => {
  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : "Internal Server Error";
  const payload = { message };
  const isDev =
    req.app.get("env") === "development" ||
    process.env.NODE_ENV === "development";
  if (isDev && err && err.stack) payload.stack = err.stack;
  res.status(status).json(payload);
});
// Export the app
module.exports = app;
