/* eslint-disable no-useless-escape */
/**
 * Escape regex char
 *
 * See: https://stackoverflow.com/questions/17885855/use-dynamic-variable-string-as-regex-pattern-in-javascript
 */
export const escapeRegExp = (stringToGoIntoTheRegex) => {
  return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
