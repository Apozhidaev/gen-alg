const utils = require('./utils');

class Roulette {
  constructor(probabilities) {
    this.intervals = [];
    this.probabilitySum = 0;
    for (let i = 0; i < probabilities.length; i++) {
      const probability = probabilities[i];
      this.probabilitySum += probability;
      this.intervals[i] = this.probabilitySum;
    }
    this.probabilities = probabilities;
  }

  next() {
    const value = Math.random() * this.probabilitySum;
    return utils.getIndex(this.intervals, value);
  }

  nextCouple() {
    const i = this.next();
    const value = Math.random();
    const pv1 = (this.probabilitySum - this.probabilities[i]) * value;
    const j = i > 0 && pv1 <= this.intervals[i - 1]
      ? utils.getIndex(this.intervals, pv1)
      : utils.getIndex(this.intervals, this.intervals[i] + (value * (this.probabilitySum - this.intervals[i])));
    return { i, j };
  }
}

module.exports = {
  Roulette,
};
