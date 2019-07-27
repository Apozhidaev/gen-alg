const utils = require('./utils');


function getLocuses(genotype) {
  const locuseCount = utils.randomInt(0, genotype.count) + 1;
  const set = new Set();
  for (let i = 0; i < locuseCount; i++) {
    set.add(utils.randomInt(0, genotype.gens.length));
  }
  const setArray = Array.from(set);
  setArray.sort((a, b) => a - b);
  return setArray;
}

function mutator(genotype) {
  const locuses = getLocuses(genotype);
  for (let i = 0; i < locuses.length; i++) {
    const locuse = locuses[i];
    genotype.gens[locuse] = !genotype.gens[locuse];
  }
}

function crossover(genotype1, genotype2) {
  const locuses = getLocuses(genotype1);
  for (let i = 0; i < locuses.length; i += 2) {
    const begin = locuses[i];
    const end = i + 1 < locuses.length ? locuses[i + 1] : genotype1.gens.length;
    for (let j = begin; j < end; j++) {
      const temp = genotype1.gens[j];
      genotype1.gens[j] = genotype2.gens[j];
      genotype2.gens[j] = temp;
    }
  }
}

module.exports = {
  mutator,
  crossover,
};
