import { escapeRegExp } from './escapeRegExp';
/**
 * Abbreviate number eg. 1000 = 1k
 *
 * Source: https://stackoverflow.com/a/9345181
 */
export var abbrValue = function (value, decimalSeparator, _decimalPlaces) {
    if (decimalSeparator === void 0) { decimalSeparator = '.'; }
    if (_decimalPlaces === void 0) { _decimalPlaces = 10; }
    if (value > 999) {
        var valueLength = ('' + value).length;
        var p = Math.pow;
        var d = p(10, _decimalPlaces);
        valueLength -= valueLength % 3;
        var abbrValue_1 = Math.round((value * d) / p(10, valueLength)) / d + ' kMGTPE'[valueLength / 3];
        return abbrValue_1.replace('.', decimalSeparator);
    }
    return String(value);
};
var abbrMap = { k: 1000, m: 1000000, b: 1000000000 };
/**
 * Parse a value with abbreviation e.g 1k = 1000
 */
export var parseAbbrValue = function (value, decimalSeparator) {
    if (decimalSeparator === void 0) { decimalSeparator = '.'; }
    var reg = new RegExp("(\\d+(".concat(escapeRegExp(decimalSeparator), "\\d*)?)([kmb])$"), 'i');
    var match = value.match(reg);
    if (match) {
        var digits = match[1], abbr = match[3];
        var multiplier = abbrMap[abbr.toLowerCase()];
        return Number(digits.replace(decimalSeparator, '.')) * multiplier;
    }
    return undefined;
};
//# sourceMappingURL=parseAbbrValue.js.map