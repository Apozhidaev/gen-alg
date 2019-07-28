const { Population, fitnessHelper } = require('../index');

function run() {
  console.log('test3');
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
    // size: 52,
    toFitness: ({ a, b }) => fitnessHelper.forValue(a, 50, 10) * fitnessHelper.forValue(b, 0.5, 0.1),
  });
  let stop = false;
  for (let i = 0; i < 1000 && !stop; i++) {
    stop = population.next();
    const { a, b } = population.best();
    console.log(`${i}. - ${a}, ${b}`);
  }
}

run();
