const { Roulette } = require('./rand-pro');
const Schema = require('./schema');
const Entity = require('./entity');
const { mutator, crossover } = require('./operator');


class Population {
  constructor({ schema, toFitness, size, options }) {
    this.schema = new Schema({ value: schema });
    this._toFitness = toFitness;
    this.entities = [];
    this.options = {
      mutation: 0.1,
      correlation: 0,
      oldStep: 0.01,
      stochastic: false,
      maxSize: 1000,
      ...options,
    };
    this.size = size || Math.min(this.schema.autoSize(), this.options.maxSize);
    for (let i = 0; i < this.size; i++) {
      this.entities.push(new Entity({ schema: this.schema }));
    }
    this._checkRadiation = () => Math.random() < this.options.mutation;
    this._adapt();
  }

  _adapt() {
    let stop = false;
    for (let i = 0; i < this.entities.length && !stop; i++) {
      const entity = this.entities[i];
      if (this.options.stochastic || entity.fitness === undefined) {
        entity.fitness = this._toFitness(entity.toObject());
        if (entity.fitness >= 1) {
          stop = true;
        }
      }
    }
    return stop;
  }

  _select() {
    const nameSet = new Set();
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (!entity.firstborn()) {
        const name = entity.toString();
        if (nameSet.has(name)) {
          entity.setCloneLabel();
        } else {
          nameSet.add(name);
        }
      }
    }
    this.entities.sort((a, b) => a.compare(b));
    const start = Math.trunc(this.size / 2);
    this.entities.splice(start, this.entities.length - start);
    this.entities.forEach((entity) => {
      entity.nextYear(this.options.oldStep);
    });
  }

  _genetic() {
    const roulette = new Roulette(this.entities.map(entity => entity.fitness));
    while (this.entities.length < this.size) {
      const { i, j } = roulette.nextCouple();
      const genotype1 = this.entities[i].toGenotype();
      const genotype2 = this.entities[j].toGenotype();

      const density = 1 - this.options.correlation;

      crossover(genotype1, genotype2, density);

      if (this._checkRadiation()) {
        mutator(genotype1, density);
      }

      if (this._checkRadiation()) {
        mutator(genotype2, density);
      }

      this.entities.push(new Entity({ schema: this.schema, genotype: genotype1 }));
      this.entities.push(new Entity({ schema: this.schema, genotype: genotype2 }));
    }
  }

  /**
  * The next generation 
  * @return {boolean} stop indicator
  */
  next() {
    this._select();
    this._genetic();
    return this._adapt();
  }

  /**
  * The best individual 
  * @return {object} individual
  */
  best() {
    const entities = this.entities.filter(entity => entity.fitness !== undefined);
    const entity = entities.reduce((out, val) => (out && out.fitness > val.fitness ? out : val), undefined);
    return entity ? entity.toObject() : undefined;
  }
}

module.exports = { Population };
