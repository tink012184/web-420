/**
 * Author: Melissa Lutz
 * Date: 8/28/2025
 * File Name: app.js
 * Description: Express app for the In-N-Out-Books project. Provides a landing page, 404/500 middleware, and exports the app for use by server.js and tests.
 */

const express = require("express");
const path = require("path");

const app = express();

// Basic parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets (optional)
app.use(express.static(path.join(__dirname, "public")));

// Root route — fully designed HTML landing page
app.get("/", (req, res) => {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>In-N-Out-Books</title>
  <style>
    :root {
      --bg: #0f1020;
      --card: #1a1b3a;
      --accent: #b99ac5;
      --accent-2: #b623d7;
      --text: #f3f4f6;
      --muted: #9ca3af;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      background: radial-gradient(1200px 600px at 10% 10%, #181a2e, var(--bg));
      color: var(--text);
    }
    header {
      padding: 2rem 1.25rem;
      max-width: 980px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand { display:flex; align-items:center; gap:.75rem; text-decoration:none; color:var(--text); font-weight:700; }
    .logo { width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,var(--accent),var(--accent-2)); display:grid; place-items:center; font-weight:900; color:#fff; }
    nav a { color:var(--muted); margin-left:1rem; text-decoration:none; }
    nav a:hover { color:var(--text); }
    main { max-width:980px; margin:0 auto; padding:2rem 1.25rem 4rem; display:grid; gap:2rem; }
    .hero {
      background: linear-gradient(180deg, rgba(185,154,197,.08), rgba(182,35,215,.06));
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 24px; padding: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,.25);
    }
    .hero h1 { margin:0 0 .5rem; font-size:clamp(1.75rem,3vw,2.5rem); }
    .hero p { color:var(--muted); margin:0 0 1.25rem; }
    .cta { display:inline-block; padding:.75rem 1rem; border-radius:12px; background:linear-gradient(135deg,var(--accent),var(--accent-2)); color:#fff; text-decoration:none; font-weight:600; box-shadow:0 6px 18px rgba(182,35,215,.35); }
    .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
    .card { background:var(--card); border:1px solid rgba(255,255,255,.08); border-radius:16px; padding:1rem; min-height:140px; }
    .card h3 { margin:.25rem 0 .5rem; font-size:1.1rem; }
    .card p { margin:0; color:var(--muted); font-size:.975rem; }
    footer { max-width:980px; margin:0 auto; padding:2rem 1.25rem 3rem; color:var(--muted); font-size:.9rem; }
    code { background:#0b0c1a; padding:.15rem .35rem; border-radius:.35rem; border:1px solid rgba(255,255,255,.08); }
  </style>
</head>
<body>
  <header>
    <a class="brand" href="/"><span class="logo">B</span> In-N-Out-Books</a>
    <nav>
      <a href="/">Home</a><a href="#features">Features</a><a href="#dev">For Developers</a>
    </nav>
  </header>
  <main>
    <section class="hero">
      <h1>Welcome to In-N-Out-Books</h1>
      <p>Track what you’ve read, organize reading lists, and share collections with your club. This is the starter server you’ll grow chapter-by-chapter.</p>
      <a class="cta" href="#features">Explore Features</a>
    </section>

    <section id="features" class="cards">
      <div class="card"><h3>Personal Library</h3><p>Add, view, and manage your books — titles, authors, genres, and notes.</p></div>
      <div class="card"><h3>Reading Status</h3><p>Track progress (To Read, Reading, Finished) with simple lists.</p></div>
      <div class="card"><h3>Book Clubs</h3><p>Create shared collections for group reading and discussion.</p></div>
      <div class="card"><h3>API-First</h3><p>REST endpoints coming in later chapters — start with a clean Express base today.</p></div>
    </section>

    <section id="dev" class="card">
      <h3>Developer Notes</h3>
      <p>This HTML is returned from the <code>GET /</code> route in <code>app.js</code>. Errors are handled by standard 404 and 500 middleware. In dev mode, stack traces will be included in 500 JSON responses.</p>
    </section>
  </main>
  <footer>© 2025 In-N-Out-Books. Built with Express.</footer>
</body>
</html>`;
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
