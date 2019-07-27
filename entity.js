const utils = require('./utils');
const Setter = require('./setter');
const Genotype = require('./genotype');

class Entity {
  constructor({ schema, genotype }) {
    this.schema = schema;
    this.oldCoef = 1;
    this.cloneLabel = false;
    /** @type {Setter[]} */
    this.setters = [];
    /** @type {Genotype} */
    this.genotype = genotype;
    if (this.genotype) {
      for (let i = 0; i < schema.fields.length; i++) {
        const field = schema.fields[i];
        this.setters.push(new Setter({ field, value: this.genotype.next(field.type) }));
      }
    } else {
      this.genotype = new Genotype();
      for (let i = 0; i < schema.fields.length; i++) {
        const field = schema.fields[i];
        const setter = new Setter({ field });
        this.setters.push(setter);
        this.genotype.push(setter.field.type, setter.value, setter.field.min, setter.field.max, setter.field.digits);
      }
    }
    this.genotype.flush();
    this.id = this.genotype.toString();
  }

  setCloneLabel(label = true) {
    this.cloneLabel = label;
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
    return this.genotype.clone();
  }

  toObject() {
    const object = {};
    for (let i = 0; i < this.setters.length; i++) {
      const setter = this.setters[i];
      utils.set(object, setter.field.path, setter.value);
    }
    return object;
  }
}

module.exports = Entity;
