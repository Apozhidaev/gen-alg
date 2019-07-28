function forValue(x, value, se) {
  if (x === value) return 1;
  const dev = Math.abs(x - value) / se;
  return Math.exp(-dev);
}

function forRange(x, a, b, se, se_b) {
  if (x >= a && x <= b) return 1;
  if (se_b !== undefined && x > b) se = se_b;
  const mean = x < a ? a : b;
  const dev = Math.abs(x - mean) / se;
  return Math.exp(-dev);
}

module.exports = {
  forValue,
  forRange,
};
