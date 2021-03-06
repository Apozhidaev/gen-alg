# gen-alg

The library of genetic algorithm

### Quick start

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
  toFitness: entity => 1 - ((entity.a - 0.5) ** 2),
});

let stop = false;
for (let i = 0; i < 1000 && !stop; i++) {
  stop = population.next(); // next generation
  const { a } = population.best();
  console.log(`${i}. - ${a}`);
}


```

### Schema example

```javascript

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
    digits: 3,
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

### Fitness helper

```javascript
/**
 * Gets fitness value
 * @param {number} x genetic field
 * @param {number} value target value
 * @param {number} se standard error (se = Math.sqrt(max - min))
 * @return {number} fitness value [0, 1]
 */
function forValue(x, value, se) {
  if (x === value) return 1;
  const dev = Math.abs(x - value) / se;
  return Math.exp(-dev);
}
```
for example:
```javascript
const { Population, fitnessHelper } = require('gen-alg');

const population = new Population({
  schema: {
    a: {
      type: 'int',
      min: 0,
      max: 100,
    },
  },
  // size: 20,
  toFitness: entity => fitnessHelper.forValue(entity.a, 50, 10),
});
let stop = false;
for (let i = 0; i < 1000 && !stop; i++) {
  stop = population.next();
  const { a } = population.best();
  console.log(`${i}. - ${a}`);
}

```

### Multiple fields

```javascript
const { Population, fitnessHelper } = require('gen-alg');

const population = new Population({
  schema: {
    a: {
      type: 'int',
      min: 0,
      max: 100,
    },
    b: {
      type: 'float',
      min: 0,
      max: 1,
      digits: 2,
    },
  },
  size: 40, // you can performance manipulate
  toFitness: ({ a, b }) => fitnessHelper.forValue(a, 50, 10) * fitnessHelper.forValue(b, 0.5, 0.1),
});
let stop = false;
for (let i = 0; i < 1000 && !stop; i++) {
  stop = population.next();
  const { a, b } = population.best();
  console.log(`${i}. - ${a}, ${b}`);
}

```


### Array hack

The array type doesn't support yet. If you want use array you can write little hack,
like that:

```javascript
const { Population, fitnessHelper } = require('gen-alg');

// ------ Array hack ------
const length = 9;
const arraySchema = {};
for (let i = 0; i < length; i++) {
  arraySchema[i] = {
    type: 'int',
    min: 0,
    max: 100,
  };
}

function toArray(entity) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(entity[i]);
  }
  return arr;
}
// -----------------------

const population = new Population({
  schema: arraySchema,
  toFitness: (entity) => {
    let fitness = 1;
    const arr = toArray(entity);
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i];
      const targetValue = (i + 1) * 10;
      fitness *= fitnessHelper.forValue(x, targetValue, 10);
    }
    return fitness;
  },
});

let stop = false;
for (let i = 0; i < 1000 && !stop; i++) {
  stop = population.next();
  const arr = toArray(population.best());
  console.log(`${i}. - ${arr.toString()}`);
}

```