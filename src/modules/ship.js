const Ship = class {
  #length;
  #hits;

  constructor(l) {
    this.length = l;
    this.#hits = 0;
  }

  get length() {
    return this.#length;
  }
  set length(val) {
    if (val <= 0) {
      throw new Error("Ship length must be positive");
    }
    this.#length = val;
  }

  get hits() {
    return this.#hits;
  }

  hit = () => {
    if (this.#hits < this.#length) {
      this.#hits++;
    }
  };

  isSunk() {
    return this.#hits === this.#length;
  }
};

export { Ship };
