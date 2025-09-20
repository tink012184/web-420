const db = require("./collection");

const seedBooks = [
  { id: 1, title: "Anything with Nothing", author: "Mercedes Lackey" },
  { id: 2, title: "A Court of Thorns and Roses", author: "Sarah J. Maas" },
  { id: 3, title: "Divergent", author: "Veronica Roth" },
];

// Initialize in-memory data on first require
db.reset(seedBooks);

module.exports = db;
