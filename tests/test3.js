const { Population } = require('../index');

async function run() {
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
    toFitness: (entity) => {
      const e1 = ((entity.a - 50) / 100) ** 2;
      const e2 = (entity.b - 0.5) ** 2;
      const e = Math.max(e1, e2);
      return 1 - e;
    },
  });
  let stop = false;
  for (let i = 0; i < 1000 && !stop; i++) {
    stop = population.next();
    const res = population.best();
    console.log(`${i}. - ${res.a}, ${res.b}`);
  }
}

run();
