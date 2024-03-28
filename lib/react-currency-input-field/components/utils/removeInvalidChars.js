"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInvalidChars = void 0;
const escapeRegExp_1 = require("./escapeRegExp");
/**
 * Remove invalid characters
 */
const removeInvalidChars = (value, validChars) => {
    const chars = (0, escapeRegExp_1.escapeRegExp)(validChars.join(''));
    const reg = new RegExp(`[^\\d${chars}]`, 'gi');
    return value.replace(reg, '');
};
exports.removeInvalidChars = removeInvalidChars;
//# sourceMappingURL=removeInvalidChars.js.map