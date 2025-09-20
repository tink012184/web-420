// Simple in-memory collection for books
let data = [];

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

const api = {
  reset(seed = []) {
    data = clone(seed);
  },
  insert(doc) {
    if (!doc || doc.id == null) throw new Error("id is required");
    data.push(clone(doc));
    return clone(doc);
  },
  deleteById(id) {
    const idx = data.findIndex((b) => String(b.id) === String(id));
    if (idx === -1) return false;
    data.splice(idx, 1);
    return true;
  },
  updateById(id, updates = {}) {
    const idx = data.findIndex((b) => String(b.id) === String(id));
    if (idx === -1) return false;
    const current = data[idx];
    data[idx] = { ...current, ...updates };
    return true;
  },
  all() {
    return clone(data);
  },
};

module.exports = api;
