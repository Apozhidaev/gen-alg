const utils = require('./utils');

const WRITE_MODE = 1;
const READ_MODE = 2;

const P2 = [];
const P_COUNT = 31;
P2[0] = 1;
for (let i = 1; i < P_COUNT; i++) {
  P2[i] = P2[i - 1] * 2;
}

const D10 = [];
const D_COUNT = 10;
D10[0] = 1;
for (let i = 1; i < D_COUNT; i++) {
  D10[i] = D10[i - 1] * 10;
}

const D10Bit = [];
for (let i = 0; i < D_COUNT; i++) {
  D10Bit[i] = utils.getBitCount(D10[i]);
}

class Genotype {
  constructor() {
    this.gens = [];
    this.count = 0;
    this.position = 0;
    this.litIndexs = [this.position];

    this.intPosition = 0;
    this.intMins = [];
    this.intMaxs = [];

    this.floatPosition = 0;
    this.floatMins = [];
    this.floatMaxs = [];
    this.floatDigits = [];

    this.mode = WRITE_MODE;
  }

  checkWrite() {
    if (this.mode !== WRITE_MODE) throw new Error('Genotype: cannot write ');
  }

  checkRead() {
    if (this.mode !== READ_MODE) throw new Error('Genotype: cannot read ');
  }

  flush() {
    this.position = 0;
    this.intPosition = 0;
    this.floatPosition = 0;
    this.mode = READ_MODE;
  }

  nextIntBase() {
    let res = 0;
    for (let i = this.litIndexs[this.position], j = 0; i < this.litIndexs[this.position + 1]; ++i, ++j) {
      if (this.gens[i]) {
        res += P2[j];
      }
    }
    ++this.position;
    return res;
  }

  pushIntBase(value, baseCount) {
    for (let i = 0; i < baseCount; i++) {
      if (value > 0) {
        const temp = Math.trunc(value / 2);
        this.gens.push(value - (temp * 2) === 1);
        value = temp;
      } else {
        this.gens.push(false);
      }
      ++this.position;
    }
    this.litIndexs.push(this.position);
    ++this.count;
  }

  nextInt() {
    this.checkRead();

    let value = this.nextIntBase();
    value += this.intMins[this.intPosition];
    const max = this.intMaxs[this.intPosition];
    if (value > max) {
      value = max;
    }
    ++this.intPosition;
    return value;
  }

  pushInt(value, min, max) {
    this.checkWrite();

    this.intMins.push(min);
    this.intMaxs.push(max);
    const baseCount = utils.getBitCount(max - min);
    this.pushIntBase(value - min, baseCount);
  }

  nextFloat() {
    this.checkRead();

    let value = this.nextIntBase();

    const min = this.floatMins[this.floatPosition];
    const max = this.floatMaxs[this.floatPosition];
    const digits = this.floatDigits[this.floatPosition];

    const mod = max - min;

    value /= D10[digits];
    value *= mod;
    value += min;

    if (value > max) {
      value = max;
    }
    ++this.floatPosition;
    return value;
  }

  pushFloat(value, min, max, digits) {
    this.checkWrite();

    this.floatMins.push(min);
    this.floatMaxs.push(max);
    this.floatDigits.push(digits);

    const mod = max - min;

    value -= min;
    value /= mod;
    value *= D10[digits];

    this.pushIntBase(Math.trunc(value), D10Bit[digits]);
  }

  push(type, value, min, max, digits) {
    switch (type) {
      case 'int':
        this.pushInt(value, min, max);
        break;
      case 'float':
        this.pushFloat(value, min, max, digits);
        break;
      default:
        throw new Error(`unknown field type: ${type}`);
    }
  }

  next(type) {
    switch (type) {
      case 'int':
        return this.nextInt();
      case 'float':
        return this.nextFloat();
      default:
        throw new Error(`unknown field type: ${type}`);
    }
  }

  toString() {
    return this.gens.map(x => (x ? '1' : '0')).join('');
  }
}

module.exports = Genotype;
