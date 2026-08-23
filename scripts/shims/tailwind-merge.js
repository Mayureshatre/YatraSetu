function twMerge(...args) {
  return args.filter(Boolean).join(' ');
}
module.exports = { twMerge };
