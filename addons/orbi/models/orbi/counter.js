// https://stackoverflow.com/questions/17313268/idiomatically-find-the-number-of-occurrences-a-given-value-has-in-an-array
class Counter extends Map {
  constructor(iter = [], key = null) {
    super();
    this.key = key || (x => x);
    for (const x of iter) {
      this.add(x);
    }
  }

  add(x) {
    x = this.key(x);
    this.set(x, (this.get(x) || 0) + 1);
  }
}

module.exports = Counter;
