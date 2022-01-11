/**
 * Merge class names
 * @param  {(false | null | undefined | string)[]} classes
 * @returns {string} string of concatenated classes
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
