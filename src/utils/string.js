export const getReplacedString = (stringWithPlaceholders, replacements) => {
  const str = stringWithPlaceholders.replace(
    /{\w+}/g,
    (placeholder) =>
      replacements[placeholder.substring(1, placeholder.length - 1)] ||
      placeholder
  );

  return str;
};
