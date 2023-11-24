import { IntlConfig } from '../CurrencyInputProps';
type LocaleConfig = {
    currencySymbol: string;
    groupSeparator: string;
    decimalSeparator: string;
    prefix: string;
    suffix: string;
};
/**
 * Get locale config from input or default
 */
export declare const getLocaleConfig: (intlConfig?: IntlConfig) => LocaleConfig;
export {};
