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
    const value1 = Math.random() * this.probabilitySum;
    const i = utils.getIndex(this.intervals, value1);
    const value2 = Math.random();
    const pv1 = (this.probabilitySum - this.probabilities[i]) * value2;
    const j = i > 0 && pv1 <= this.intervals[i - 1]
      ? utils.getIndex(this.intervals, pv1)
      : utils.getIndex(this.intervals, this.intervals[i] + (value2 * (this.probabilitySum - this.intervals[i])));
    return { i, j };
  }
}

module.exports = {
  Roulette,
};
