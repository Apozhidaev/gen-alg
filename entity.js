const utils = require('./utils');
const Setter = require('./setter');
const Genotype = require('./genotype');

class Entity {
  constructor({ schema, genotype }) {
    this.schema = schema;
    this.oldCoef = 1;
    this.setters = [];
    if (genotype) {
      for (let i = 0; i < schema.fields.length; i++) {
        const field = schema.fields[i];
        this.setters.push(new Setter({ field, value: genotype.next(field.type) }));
      }
      this.name = genotype.toString();
    } else {
      for (let i = 0; i < schema.fields.length; i++) {
        const field = schema.fields[i];
        this.setters.push(new Setter({ field }));
      }
      this.name = 'firstborn';
    }
    this.cloneLabel = false;
  }

  setCloneLabel(label = true) {
    this.cloneLabel = label;
  }

  firstborn() {
    return this.name === 'firstborn';
  }

  nextYear(oldStep) {
    if (this.oldCoef > 0) {
      this.oldCoef -= oldStep;
    }
    if (this.oldCoef < 0) {
      this.oldCoef = 0;
    }
  }

  compare(other) {
    if (this.cloneLabel === other.cloneLabel) {
      if (this.fitness !== undefined && other.fitness !== undefined) {
        return (other.oldCoef * other.fitness) - (this.oldCoef * this.fitness);
      }
      if (this.fitness !== undefined) {
        return -1;
      }
      if (other.fitness !== undefined) {
        return 1;
      }
      return 0;
    }
    return this.cloneLabel ? 1 : -1;
  }

  toGenotype() {
    const genotype = new Genotype();
    for (let i = 0; i < this.setters.length; i++) {
      const setter = this.setters[i];
      genotype.push(setter.field.type, setter.value, setter.field.min, setter.field.max, setter.field.digits);
    }
    genotype.flush();
    return genotype;
  }

  toObject() {
    const object = {};
    for (let i = 0; i < this.setters.length; i++) {
      const setter = this.setters[i];
      utils.set(object, setter.field.path, setter.value);
    }
    return object;
  }

  toString() {
    return this.name;
  }
}

module.exports = Entity;
