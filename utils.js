function getIndex(values, x) {
  const n = values.length;

  if (n === 0) {
    return 0;
  }
  if (values[0] > x) {
    return 0;
  }
  if (values[n - 1] < x) {
    return n;
  }

  let first = 0;
  let last = n;
  let mid = first + Math.trunc((last - first) / 2);

  while (first < last) {
    if (x <= values[mid]) {
      last = mid;
    } else {
      first = mid + 1;
    }
    mid = first + Math.trunc((last - first) / 2);
  }

  return last;
}

function getBitCount(value) {
  if (value === 0) return 0;
  return Math.trunc(Math.log2(value)) + 1;
}

function randomFloat(min = 0, max = 1) {
  return (Math.random() * (max - min)) + min;
}

function randomInt(min = 0, max = Number.MAX_SAFE_INTEGER) {
  return Math.trunc(randomFloat(min, max));
}

function randomInRange(min = 0, max = Number.MAX_SAFE_INTEGER - 1) {
  return randomInt(min, max + 1);
}

function set(object, path, value) {
  const keys = path.split('.');
  let targetObject = object;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i < keys.length - 1) {
      targetObject = targetObject[key] || (targetObject[key] = {});
    } else {
      targetObject[key] = value;
    }
  }
}

module.exports = {
  getIndex,
  getBitCount,
  randomInt,
  randomFloat,
  randomInRange,
  set,
};
