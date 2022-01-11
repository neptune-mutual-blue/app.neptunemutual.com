export const getOne = (...opts) => {
  return opts[Math.floor(Math.random() * opts.length)];
};
