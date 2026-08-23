function clsx(...args) {
  return args
    .flat(Infinity)
    .filter(Boolean)
    .join(' ');
}
module.exports = { clsx, default: clsx };
