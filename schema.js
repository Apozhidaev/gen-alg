/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const utils = require('./utils');


const schema = {
  field1: {
    type: 'int',
    min: 0,
    max: 100,
  },
  field2: {
    type: 'float',
    min: 0,
    max: 1,
    digits: 2,
  },
  field3: {
    type: 'object',
    fields: {
      field1: {
        type: 'int',
        min: 0,
        max: 50,
      }
    }
  },
};

function parseSchema(schema, fields, prefix = '') {
  for (const field in schema) {
    const summary = schema[field];
    switch (summary.type) {
      case 'int':
      case 'float':
        fields.push({
          ...summary,
          path: prefix + field,
        });
        break;
      case 'object':
        parseSchema(summary.fields, fields, `${prefix + field}.`);
        break;
      default:
        throw new Error(`unknown field type: ${summary.type}`);
    }
  }
}

class Schema {
  constructor({ value }) {
    this.value = value;
    this.fields = [];
    parseSchema(value, this.fields);
    this.fields.sort((a, b) => {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });
  }

  autoSize() {
    let genCount = 0;
    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      switch (field.type) {
        case 'int':
          genCount += utils.getBitCount(field.max - field.min);
          break;
        case 'float':
          genCount += utils.getBitCount(10 ** field.digits);
          break;
        default:
          throw new Error(`unknown field type: ${field.type}`);
      }
    }
    return 20 + (2 * Math.trunc(genCount * Math.log10(genCount)));
  }
}

module.exports = Schema;
