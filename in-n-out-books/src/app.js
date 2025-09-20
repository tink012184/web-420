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

// 404 middleware — after all routes
app.use((req, res) => {
  res
    .status(404)
    .type("text")
    .send("404 Not Found — The resource you requested does not exist.");
});

// 500 error-handling middleware (note 4 args)
app.use((err, req, res, next) => {
  const isDev =
    req.app.get("env") === "development" ||
    process.env.NODE_ENV === "development";
  const payload = { status: 500, message: "Internal Server Error" };
  if (isDev && err && err.stack) payload.stack = err.stack;
  const status = err && err.status ? err.status : 500;
  res.status(status).json(payload);
});

// Export the app
module.exports = app;
