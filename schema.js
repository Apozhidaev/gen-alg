const utils = require('./utils');


function checkParams(fields) {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    switch (field.type) {
      case 'int':
      case 'float':
        if (!('max' in field)) throw Error(`schema.${field.path}, don't have "max" property`);
        if (!('min' in field)) throw Error(`schema.${field.path}, don't have "min" property`);
        if (field.type === 'float' && !('digits' in field)) throw Error(`schema.${field.path}, don't have "digits" property`);
        break;
      default:
        throw new Error(`unknown field type: ${field.type}`);
    }
  }
}

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
    checkParams(this.fields);
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
    return 20 + (genCount ** 2); // 20 - min value
  }
}

module.exports = Schema;
