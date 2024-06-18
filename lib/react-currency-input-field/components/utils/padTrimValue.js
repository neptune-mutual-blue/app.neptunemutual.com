"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padTrimValue = void 0;
const padTrimValue = (value, decimalSeparator = '.', decimalScale) => {
    if (decimalScale === undefined || value === '' || value === undefined) {
        return value;
    }
    if (!value.match(/\d/g)) {
        return '';
    }
    const [int, decimals] = value.split(decimalSeparator);
    if (decimalScale === 0) {
        return int;
    }
    let newValue = decimals || '';
    if (newValue.length < decimalScale) {
        while (newValue.length < decimalScale) {
            newValue += '0';
        }
    }
    else {
        newValue = newValue.slice(0, decimalScale);
    }
    return `${int}${decimalSeparator}${newValue}`;
};
exports.padTrimValue = padTrimValue;
//# sourceMappingURL=padTrimValue.js.map