var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { escapeRegExp } from './escapeRegExp';
import { getSuffix } from './getSuffix';
/**
 * Format value with decimal separator, group separator and prefix
 */
export var formatValue = function (options) {
    var _value = options.value, decimalSeparator = options.decimalSeparator, intlConfig = options.intlConfig, decimalScale = options.decimalScale, _a = options.prefix, prefix = _a === void 0 ? '' : _a, _b = options.suffix, suffix = _b === void 0 ? '' : _b;
    if (_value === '' || _value === undefined) {
        return '';
    }
    if (_value === '-') {
        return '-';
    }
    var isNegative = new RegExp("^\\d?-".concat(prefix ? "".concat(escapeRegExp(prefix), "?") : '', "\\d")).test(_value);
    var value = decimalSeparator !== '.'
        ? replaceDecimalSeparator(_value, decimalSeparator, isNegative)
        : _value;
    var defaultNumberFormatOptions = {
        minimumFractionDigits: decimalScale || 0,
        maximumFractionDigits: 20,
    };
    var numberFormatter = intlConfig
        ? new Intl.NumberFormat(intlConfig.locale, intlConfig.currency
            ? __assign(__assign({}, defaultNumberFormatOptions), { style: 'currency', currency: intlConfig.currency }) : defaultNumberFormatOptions)
        : new Intl.NumberFormat(undefined, defaultNumberFormatOptions);
    var parts = numberFormatter.formatToParts(Number(value));
    var formatted = replaceParts(parts, options);
    // Does intl formatting add a suffix?
    var intlSuffix = getSuffix(formatted, __assign({}, options));
    // Include decimal separator if user input ends with decimal separator
    var includeDecimalSeparator = _value.slice(-1) === decimalSeparator ? decimalSeparator : '';
    var _c = value.match(RegExp('\\d+\\.(\\d+)')) || [], decimals = _c[1];
    // Keep original decimal padding if no decimalScale
    if (decimalScale === undefined && decimals && decimalSeparator) {
        if (formatted.includes(decimalSeparator)) {
            formatted = formatted.replace(RegExp("(\\d+)(".concat(escapeRegExp(decimalSeparator), ")(\\d+)"), 'g'), "$1$2".concat(decimals));
        }
        else {
            if (intlSuffix && !suffix) {
                formatted = formatted.replace(intlSuffix, "".concat(decimalSeparator).concat(decimals).concat(intlSuffix));
            }
            else {
                formatted = "".concat(formatted).concat(decimalSeparator).concat(decimals);
            }
        }
    }
    if (suffix && includeDecimalSeparator) {
        return "".concat(formatted).concat(includeDecimalSeparator).concat(suffix);
    }
    if (intlSuffix && includeDecimalSeparator) {
        return formatted.replace(intlSuffix, "".concat(includeDecimalSeparator).concat(intlSuffix));
    }
    if (intlSuffix && suffix) {
        return formatted.replace(intlSuffix, "".concat(includeDecimalSeparator).concat(suffix));
    }
    return [formatted, includeDecimalSeparator, suffix].join('');
};
/**
 * Before converting to Number, decimal separator has to be .
 */
var replaceDecimalSeparator = function (value, decimalSeparator, isNegative) {
    var newValue = value;
    if (decimalSeparator && decimalSeparator !== '.') {
        newValue = newValue.replace(RegExp(escapeRegExp(decimalSeparator), 'g'), '.');
        if (isNegative && decimalSeparator === '-') {
            newValue = "-".concat(newValue.slice(1));
        }
    }
    return newValue;
};
var replaceParts = function (parts, _a) {
    var prefix = _a.prefix, groupSeparator = _a.groupSeparator, decimalSeparator = _a.decimalSeparator, decimalScale = _a.decimalScale, _b = _a.disableGroupSeparators, disableGroupSeparators = _b === void 0 ? false : _b;
    return parts
        .reduce(function (prev, _a, i) {
        var type = _a.type, value = _a.value;
        if (i === 0 && prefix) {
            if (type === 'minusSign') {
                return [value, prefix];
            }
            if (type === 'currency') {
                return __spreadArray(__spreadArray([], prev, true), [prefix], false);
            }
            return [prefix, value];
        }
        if (type === 'currency') {
            return prefix ? prev : __spreadArray(__spreadArray([], prev, true), [value], false);
        }
        if (type === 'group') {
            return !disableGroupSeparators
                ? __spreadArray(__spreadArray([], prev, true), [groupSeparator !== undefined ? groupSeparator : value], false) : prev;
        }
        if (type === 'decimal') {
            if (decimalScale !== undefined && decimalScale === 0) {
                return prev;
            }
            return __spreadArray(__spreadArray([], prev, true), [decimalSeparator !== undefined ? decimalSeparator : value], false);
        }
        if (type === 'fraction') {
            return __spreadArray(__spreadArray([], prev, true), [decimalScale !== undefined ? value.slice(0, decimalScale) : value], false);
        }
        return __spreadArray(__spreadArray([], prev, true), [value], false);
    }, [''])
        .join('');
};
//# sourceMappingURL=formatValue.js.map