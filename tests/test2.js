const { Population, fitnessHelper } = require('../index');

function run() {
  console.log('test2');
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
}

run();
