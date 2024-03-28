"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocaleConfig = void 0;
const defaultConfig = {
    currencySymbol: '',
    groupSeparator: '',
    decimalSeparator: '',
    prefix: '',
    suffix: '',
};
/**
 * Get locale config from input or default
 */
const getLocaleConfig = (intlConfig) => {
    const { locale, currency } = intlConfig || {};
    const numberFormatter = locale
        ? new Intl.NumberFormat(locale, currency ? { currency, style: 'currency' } : undefined)
        : new Intl.NumberFormat();
    return numberFormatter.formatToParts(1000.1).reduce((prev, curr, i) => {
        if (curr.type === 'currency') {
            if (i === 0) {
                return { ...prev, currencySymbol: curr.value, prefix: curr.value };
            }
            else {
                return { ...prev, currencySymbol: curr.value, suffix: curr.value };
            }
        }
        if (curr.type === 'group') {
            return { ...prev, groupSeparator: curr.value };
        }
        if (curr.type === 'decimal') {
            return { ...prev, decimalSeparator: curr.value };
        }
        return prev;
    }, defaultConfig);
};
exports.getLocaleConfig = getLocaleConfig;
//# sourceMappingURL=getLocaleConfig.js.map