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

/**
 * Gets fitness value
 * @param {number} x genetic field
 * @param {number} value opposite value
 * @param {number} se standard error (se = Math.sqrt(max - min))
 * @return {number} fitness value [0, 1]
 */
function oppValue(x, value, se) {
  return 1 - forValue(x, value, se);
}

/**
 * Gets fitness value
 * @param {number} x genetic field
 * @param {number} a right board target range
 * @param {number} b left board target range
 * @param {number} se standard error (se = Math.sqrt(max - min))
 * @param {number?} se_b standard error for [b, max] interval
 * @return {number} fitness value [0, 1]
 */
function forRange(x, a, b, se, se_b) {
  if (x >= a && x <= b) return 1;
  if (se_b !== undefined && x > b) se = se_b;
  const mean = x < a ? a : b;
  const dev = Math.abs(x - mean) / se;
  return Math.exp(-dev);
}

module.exports = {
  forValue,
  oppValue,
  forRange,
};
