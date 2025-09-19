// Simple in-memory collection helper
module.exports = function makeCollection(initialItems = []) {
  let items = initialItems.map((i) => ({ ...i }));

  return {
    getAll() {
      return items.map((i) => ({ ...i }));
    },
    findById(id) {
      return items.find((b) => b.id === id) || null;
    },
    updateById(id, data) {
      const idx = items.findIndex((b) => b.id === id);
      if (idx === -1) return false;
      items[idx] = { ...items[idx], ...data, id }; // keep id stable
      return true;
    },
    _reset() {
      items = initialItems.map((i) => ({ ...i }));
    },
  };
};
