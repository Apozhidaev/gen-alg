const { Population, fitnessHelper } = require('../index');

function run() {
  console.log('test4');

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
  console.log(population.size);

  let stop = false;
  for (let i = 0; i < 10000 && !stop; i++) {
    stop = population.next();
    const arr = toArray(population.best());
    console.log(`${i}. - ${arr.toString()}`);
  }
}

run();
