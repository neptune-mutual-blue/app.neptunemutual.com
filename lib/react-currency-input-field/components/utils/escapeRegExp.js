"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegExp = void 0;
/**
 * Escape regex char
 *
 * See: https://stackoverflow.com/questions/17885855/use-dynamic-variable-string-as-regex-pattern-in-javascript
 */
const escapeRegExp = (stringToGoIntoTheRegex) => {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
exports.escapeRegExp = escapeRegExp;
