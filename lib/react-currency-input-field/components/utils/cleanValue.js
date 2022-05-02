"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanValue = void 0;
const parseAbbrValue_1 = require("./parseAbbrValue");
const removeSeparators_1 = require("./removeSeparators");
const removeInvalidChars_1 = require("./removeInvalidChars");
const escapeRegExp_1 = require("./escapeRegExp");
/**
 * Remove prefix, separators and extra decimals from value
 */
const cleanValue = ({ value, groupSeparator = ',', decimalSeparator = '.', allowDecimals = true, decimalsLimit = 2, allowNegativeValue = true, disableAbbreviations = false, prefix = '', transformRawValue = (rawValue) => rawValue, }) => {
    const transformedValue = transformRawValue(value);
    if (transformedValue === '-') {
        return transformedValue;
    }
    const abbreviations = disableAbbreviations ? [] : ['k', 'm', 'b'];
    const reg = new RegExp(`((^|\\D)-\\d)|(-${escapeRegExp_1.escapeRegExp(prefix)})`);
    const isNegative = reg.test(transformedValue);
    // Is there a digit before the prefix? eg. 1$
    const [prefixWithValue, preValue] = RegExp(`(\\d+)-?${escapeRegExp_1.escapeRegExp(prefix)}`).exec(value) || [];
    const withoutPrefix = prefix
        ? prefixWithValue
            ? transformedValue.replace(prefixWithValue, '').concat(preValue)
            : transformedValue.replace(prefix, '')
        : transformedValue;
    const withoutSeparators = removeSeparators_1.removeSeparators(withoutPrefix, groupSeparator);
    const withoutInvalidChars = removeInvalidChars_1.removeInvalidChars(withoutSeparators, [
        groupSeparator,
        decimalSeparator,
        ...abbreviations,
    ]);
    let valueOnly = withoutInvalidChars;
    if (!disableAbbreviations) {
        // disallow letter without number
        if (abbreviations.some((letter) => letter === withoutInvalidChars.toLowerCase())) {
            return '';
        }
        const parsed = parseAbbrValue_1.parseAbbrValue(withoutInvalidChars, decimalSeparator);
        if (parsed) {
            valueOnly = String(parsed);
        }
    }
    const includeNegative = isNegative && allowNegativeValue ? '-' : '';
    if (decimalSeparator && valueOnly.includes(decimalSeparator)) {
        const [int, decimals] = withoutInvalidChars.split(decimalSeparator);
        const trimmedDecimals = decimalsLimit && decimals ? decimals.slice(0, decimalsLimit) : decimals;
        const includeDecimals = allowDecimals ? `${decimalSeparator}${trimmedDecimals}` : '';
        return `${includeNegative}${int}${includeDecimals}`;
    }
    return `${includeNegative}${valueOnly}`;
};
exports.cleanValue = cleanValue;
