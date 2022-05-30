/**
 * Merge class names
 * @param  {(false | null | undefined | string)[]} classes
 * @returns {string} string of concatenated classes
 */
export function classNames(...classes) {
  const finalClasses = [];

  for (const value of classes) {
    if (typeof value === "string") {
      const trimedValue = value.trim();
      if (trimedValue.length) {
        finalClasses.push(value);
      }
      continue;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      const arrayOfClasses = Object.entries(value).reduce(
        (arr, [key, value]) => {
          if (value) {
            arr.push(key);
          }

          return arr;
        }, []
      );

      finalClasses.push(...arrayOfClasses);
    }
  }

  return finalClasses.join(" ");
}