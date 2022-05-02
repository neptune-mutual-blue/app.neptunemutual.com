"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSeparators = void 0;
const escapeRegExp_1 = require("./escapeRegExp");
/**
 * Remove group separator from value eg. 1,000 > 1000
 */
const removeSeparators = (value, separator = ',') => {
    const reg = new RegExp(escapeRegExp_1.escapeRegExp(separator), 'g');
    return value.replace(reg, '');
};
exports.removeSeparators = removeSeparators;
