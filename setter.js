const utils = require('./utils');

class Setter {
  constructor({ field, value }) {
    this.field = field;
    if (value === undefined) {
      switch (field.type) {
        case 'int':
          this.value = utils.randomInt(field.min, field.max);
          break;
        case 'float':
          this.value = utils.randomFloat(field.min, field.max);
          break;
        default:
          throw new Error(`unknown field type: ${field.type}`);
      }
    } else {
      this.value = value;
    }
  }
}

module.exports = Setter;
