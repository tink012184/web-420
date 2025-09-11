// Simple in-memory collection for books
let data = [];

module.exports = {
  reset(seed = []) {
    data = seed.slice();
  },
  insert(doc) {
    if (!doc || doc.id == null) throw new Error("id is required");
    data.push(doc);
    return doc;
  },
  deleteById(id) {
    const idx = data.findIndex((b) => String(b.id) === String(id));
    if (idx === -1) return false;
    data.splice(idx, 1);
    return true;
  },
  all() {
    return data.slice();
  },
};
