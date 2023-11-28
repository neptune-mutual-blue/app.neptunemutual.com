import { CurrencyInputProps } from '../CurrencyInputProps';
export type CleanValueOptions = Pick<CurrencyInputProps, 'decimalSeparator' | 'groupSeparator' | 'allowDecimals' | 'decimalsLimit' | 'allowNegativeValue' | 'disableAbbreviations' | 'prefix' | 'transformRawValue'> & {
    value: string;
};
/**
 * Remove prefix, separators and extra decimals from value
 */
export declare const cleanValue: ({ value, groupSeparator, decimalSeparator, allowDecimals, decimalsLimit, allowNegativeValue, disableAbbreviations, prefix, transformRawValue, }: CleanValueOptions) => string;
