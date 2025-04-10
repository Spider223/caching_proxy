const cache = new Map();

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value) => cache.set(key, value),
  has: (key) => cache.has(key),
  clear: () => cache.clear(),
};
