import { escapeRegExp } from './escapeRegExp';
/**
 * Remove invalid characters
 */
export var removeInvalidChars = function (value, validChars) {
    var chars = escapeRegExp(validChars.join(''));
    var reg = new RegExp("[^\\d".concat(chars, "]"), 'gi');
    return value.replace(reg, '');
};
//# sourceMappingURL=removeInvalidChars.js.map