class Floor {
  #collection = new Set();

  constructor(name) {
    this.name = name;
  }

  toJSON() {
    return {
      name: this.name,
      count: this.size(),
      occupied: this.isOccupied(),
      empty: this.isEmpty(),
    };
  }

  add(person) {
    this.#collection.add(person);
  }

  remove(person) {
    this.#collection.delete(person);
  }

  empty() {
    this.#collection.clear();
  }

  size() {
    return this.#collection.size;
  }

  isEmpty() {
    return this.#collection.size === 0;
  }

  isOccupied() {
    return this.#collection.size !== 0;
  }
}

module.exports = Floor;
