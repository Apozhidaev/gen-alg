const { Population } = require('../index');

async function run() {
  console.log('test2');
  const population = new Population({
    schema: {
      a: {
        type: 'int',
        min: 0,
        max: 100,
      },
    },
    size: 10,
    toFitness: entity => 1 - (((entity.a - 50) / 100) ** 2),
  });
  let stop = false;
  for (let i = 0; i < 1000 && !stop; i++) {
    stop = population.next();
    const res = population.best().a;
    console.log(`${i}. - ${res}`);
  }
}

run();
