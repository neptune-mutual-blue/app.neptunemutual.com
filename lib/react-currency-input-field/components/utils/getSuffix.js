"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuffix = void 0;
const escapeRegExp_1 = require("./escapeRegExp");
const getSuffix = (value, { groupSeparator = ',', decimalSeparator = '.' }) => {
    const suffixReg = new RegExp(`\\d([^${escapeRegExp_1.escapeRegExp(groupSeparator)}${escapeRegExp_1.escapeRegExp(decimalSeparator)}0-9]+)`);
    const suffixMatch = value.match(suffixReg);
    return suffixMatch ? suffixMatch[1] : undefined;
};
exports.getSuffix = getSuffix;
