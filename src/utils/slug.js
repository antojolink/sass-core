function generateSlug(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = {
  generateSlug,
};
