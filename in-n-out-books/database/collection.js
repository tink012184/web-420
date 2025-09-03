// Simple in-memory "collection" with find and findOne helpers
class Collection {
  constructor(items = []) {
    this.items = items;
  }

  find() {
    return this.items;
  }

  findOne(query = {}) {
    if (Object.prototype.hasOwnProperty.call(query, "id")) {
      return this.items.find((doc) => doc.id === query.id) ?? null;
    }
    return null;
  }
}

module.exports = { Collection };
