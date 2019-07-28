const { Population } = require('../index');

function run() {
  console.log('test1');
  const population = new Population({
    schema: {
      a: {
        type: 'float',
        min: 0,
        max: 1,
        digits: 2,
      },
    },
    // size: 20,
    toFitness: entity => 1 - ((entity.a - 0.5) ** 2),
  });
  let stop = false;
  for (let i = 0; i < 1000 && !stop; i++) {
    stop = population.next();
    const { a } = population.best();
    console.log(`${i}. - ${a}`);
  }
}

run();
