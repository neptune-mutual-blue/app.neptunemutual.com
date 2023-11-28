import { escapeRegExp } from './escapeRegExp';
/**
 * Remove group separator from value eg. 1,000 > 1000
 */
export var removeSeparators = function (value, separator) {
    if (separator === void 0) { separator = ','; }
    var reg = new RegExp(escapeRegExp(separator), 'g');
    return value.replace(reg, '');
};
//# sourceMappingURL=removeSeparators.js.map