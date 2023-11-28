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
var defaultConfig = {
    currencySymbol: '',
    groupSeparator: '',
    decimalSeparator: '',
    prefix: '',
    suffix: '',
};
/**
 * Get locale config from input or default
 */
export var getLocaleConfig = function (intlConfig) {
    var _a = intlConfig || {}, locale = _a.locale, currency = _a.currency;
    var numberFormatter = locale
        ? new Intl.NumberFormat(locale, currency ? { currency: currency, style: 'currency' } : undefined)
        : new Intl.NumberFormat();
    return numberFormatter.formatToParts(10000.1).reduce(function (prev, curr, i) {
        if (curr.type === 'currency') {
            if (i === 0) {
                return __assign(__assign({}, prev), { currencySymbol: curr.value, prefix: curr.value });
            }
            else {
                return __assign(__assign({}, prev), { currencySymbol: curr.value, suffix: curr.value });
            }
        }
        if (curr.type === 'group') {
            return __assign(__assign({}, prev), { groupSeparator: curr.value });
        }
        if (curr.type === 'decimal') {
            return __assign(__assign({}, prev), { decimalSeparator: curr.value });
        }
        return prev;
    }, defaultConfig);
};
//# sourceMappingURL=getLocaleConfig.js.map