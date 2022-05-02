"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAbbrValue = exports.abbrValue = void 0;
const escapeRegExp_1 = require("./escapeRegExp");
/**
 * Abbreviate number eg. 1000 = 1k
 *
 * Source: https://stackoverflow.com/a/9345181
 */
const abbrValue = (value, decimalSeparator = '.', _decimalPlaces = 10) => {
    if (value > 999) {
        let valueLength = ('' + value).length;
        const p = Math.pow;
        const d = p(10, _decimalPlaces);
        valueLength -= valueLength % 3;
        const abbrValue = Math.round((value * d) / p(10, valueLength)) / d + ' kMGTPE'[valueLength / 3];
        return abbrValue.replace('.', decimalSeparator);
    }
    return String(value);
};
exports.abbrValue = abbrValue;
const abbrMap = { k: 1000, m: 1000000, b: 1000000000 };
/**
 * Parse a value with abbreviation e.g 1k = 1000
 */
const parseAbbrValue = (value, decimalSeparator = '.') => {
    const reg = new RegExp(`(\\d+(${escapeRegExp_1.escapeRegExp(decimalSeparator)}\\d*)?)([kmb])$`, 'i');
    const match = value.match(reg);
    if (match) {
        const [, digits, , abbr] = match;
        const multiplier = abbrMap[abbr.toLowerCase()];
        return Number(digits.replace(decimalSeparator, '.')) * multiplier;
    }
    return undefined;
};
exports.parseAbbrValue = parseAbbrValue;
