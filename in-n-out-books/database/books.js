const makeCollection = require("./collection");

const seed = [
  {
    id: 1,
    title: "Anything with Nothing",
    author: "Mercedes Lackey",
  },
  {
    id: 2,
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
  },
  {
    id: 3,
    title: "Divergent",
    author: "Veronica Roth",
  },
];

const books = makeCollection(seed);

module.exports = books;
