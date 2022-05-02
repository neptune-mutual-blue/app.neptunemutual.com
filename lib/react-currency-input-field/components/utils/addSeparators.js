"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSeparators = void 0;
/**
 * Add group separator to value eg. 1000 > 1,000
 */
const addSeparators = (value, separator = ',') => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
exports.addSeparators = addSeparators;
