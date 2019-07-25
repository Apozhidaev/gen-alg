# gen-alg

The library of genetic algorithm

```javascript
const { Population } = require('gen-alg');

const population = new Population({
  schema: {
    a: {
      type: 'float',
      min: 0,
      max: 1,
      digits: 2,
    },
  },
  // size: 10,
  toFitness: entity => 1 - ((entity.a - 0.5) ** 2),
});
let stop = false;
for (let i = 0; i < 1000 && !stop; i++) {
  stop = population.next();
  const res = population.best().a;
  console.log(`${i}. - ${res}`);
}

// schema example
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

```