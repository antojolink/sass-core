function parseAndFormatPrice(value) {
  if (typeof value === 'boolean' || value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  if (typeof value !== 'number' && typeof value !== 'string') {
    return null;
  }

  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return null;
  }

  return num.toFixed(2);
}

module.exports = {
  parseAndFormatPrice,
};
