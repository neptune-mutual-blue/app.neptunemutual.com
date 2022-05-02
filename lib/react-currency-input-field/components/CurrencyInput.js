"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyInput = void 0;
const react_1 = __importStar(require("react"));
const utils_1 = require("./utils");
exports.CurrencyInput = react_1.forwardRef((_a, ref) => {
    var { allowDecimals = true, allowNegativeValue = true, id, name, className, customInput, decimalsLimit, defaultValue, disabled = false, maxLength: userMaxLength, value: userValue, onValueChange, fixedDecimalLength, placeholder, decimalScale, prefix, suffix, intlConfig, step, min, max, disableGroupSeparators = false, disableAbbreviations = false, decimalSeparator: _decimalSeparator, groupSeparator: _groupSeparator, onChange, onFocus, onBlur, onKeyDown, onKeyUp, transformRawValue } = _a, props = __rest(_a, ["allowDecimals", "allowNegativeValue", "id", "name", "className", "customInput", "decimalsLimit", "defaultValue", "disabled", "maxLength", "value", "onValueChange", "fixedDecimalLength", "placeholder", "decimalScale", "prefix", "suffix", "intlConfig", "step", "min", "max", "disableGroupSeparators", "disableAbbreviations", "decimalSeparator", "groupSeparator", "onChange", "onFocus", "onBlur", "onKeyDown", "onKeyUp", "transformRawValue"]);
    if (_decimalSeparator && utils_1.isNumber(_decimalSeparator)) {
        throw new Error('decimalSeparator cannot be a number');
    }
    if (_groupSeparator && utils_1.isNumber(_groupSeparator)) {
        throw new Error('groupSeparator cannot be a number');
    }
    const localeConfig = react_1.useMemo(() => utils_1.getLocaleConfig(intlConfig), [intlConfig]);
    const decimalSeparator = _decimalSeparator || localeConfig.decimalSeparator || '';
    const groupSeparator = _groupSeparator || localeConfig.groupSeparator || '';
    if (decimalSeparator &&
        groupSeparator &&
        decimalSeparator === groupSeparator &&
        disableGroupSeparators === false) {
        throw new Error('decimalSeparator cannot be the same as groupSeparator');
    }
    const formatValueOptions = {
        decimalSeparator,
        groupSeparator,
        disableGroupSeparators,
        intlConfig,
        prefix: prefix || localeConfig.prefix,
        suffix: suffix,
    };
    const cleanValueOptions = {
        decimalSeparator,
        groupSeparator,
        allowDecimals,
        decimalsLimit: decimalsLimit || fixedDecimalLength || 2,
        allowNegativeValue,
        disableAbbreviations,
        prefix: prefix || localeConfig.prefix,
        transformRawValue,
    };
    const formattedStateValue = defaultValue !== undefined && defaultValue !== null
        ? utils_1.formatValue(Object.assign(Object.assign({}, formatValueOptions), { decimalScale, value: String(defaultValue) }))
        : userValue !== undefined && userValue !== null
            ? utils_1.formatValue(Object.assign(Object.assign({}, formatValueOptions), { decimalScale, value: String(userValue) }))
            : '';
    const [stateValue, setStateValue] = react_1.useState(formattedStateValue);
    const [dirty, setDirty] = react_1.useState(false);
    const [cursor, setCursor] = react_1.useState(0);
    const inputRef = ref || react_1.useRef(null);
    /**
     * Process change in value
     */
    const processChange = (value, selectionStart) => {
        setDirty(true);
        const stringValue = utils_1.cleanValue(Object.assign({ value }, cleanValueOptions));
        if (userMaxLength && stringValue.replace(/-/g, '').length > userMaxLength) {
            return;
        }
        if (stringValue === '' || stringValue === '-' || stringValue === decimalSeparator) {
            onValueChange && onValueChange(undefined, name, { float: null, formatted: '', value: '' });
            setStateValue(stringValue);
            return;
        }
        const numberValue = parseFloat(stringValue.replace(decimalSeparator, '.'));
        const formattedValue = utils_1.formatValue(Object.assign({ value: stringValue }, formatValueOptions));
        /* istanbul ignore next */
        if (selectionStart !== undefined && selectionStart !== null) {
            // Prevent cursor jumping
            const newCursor = selectionStart + (formattedValue.length - value.length) || 1;
            setCursor(newCursor);
        }
        setStateValue(formattedValue);
        if (onValueChange) {
            const values = {
                float: numberValue,
                formatted: formattedValue,
                value: stringValue,
            };
            onValueChange(stringValue, name, values);
        }
    };
    /**
     * Handle change event
     */
    const handleOnChange = (event) => {
        const { target: { value, selectionStart }, } = event;
        processChange(value, selectionStart);
        onChange && onChange(event);
    };
    /**
     * Handle focus event
     */
    const handleOnFocus = (event) => {
        onFocus && onFocus(event);
        return stateValue ? stateValue.length : 0;
    };
    /**
     * Handle blur event
     *
     * Format value by padding/trimming decimals if required by
     */
    const handleOnBlur = (event) => {
        const { target: { value }, } = event;
        const valueOnly = utils_1.cleanValue(Object.assign({ value }, cleanValueOptions));
        if (valueOnly === '-' || !valueOnly) {
            setStateValue('');
            onBlur && onBlur(event);
            return;
        }
        const fixedDecimals = utils_1.fixedDecimalValue(valueOnly, decimalSeparator, fixedDecimalLength);
        const newValue = utils_1.padTrimValue(fixedDecimals, decimalSeparator, decimalScale !== undefined ? decimalScale : fixedDecimalLength);
        const numberValue = parseFloat(newValue.replace(decimalSeparator, '.'));
        const formattedValue = utils_1.formatValue(Object.assign(Object.assign({}, formatValueOptions), { value: newValue }));
        if (onValueChange) {
            onValueChange(newValue, name, {
                float: numberValue,
                formatted: formattedValue,
                value: newValue,
            });
        }
        setStateValue(formattedValue);
        onBlur && onBlur(event);
    };
    /**
     * Handle key down event
     *
     * Increase or decrease value by step
     */
    const handleOnKeyDown = (event) => {
        const { key } = event;
        if (step && (key === 'ArrowUp' || key === 'ArrowDown')) {
            event.preventDefault();
            setCursor(stateValue.length);
            const currentValue = parseFloat(userValue !== undefined && userValue !== null
                ? String(userValue).replace(decimalSeparator, '.')
                : utils_1.cleanValue(Object.assign({ value: stateValue }, cleanValueOptions))) || 0;
            const newValue = key === 'ArrowUp' ? currentValue + step : currentValue - step;
            if (min !== undefined && newValue < min) {
                return;
            }
            if (max !== undefined && newValue > max) {
                return;
            }
            const fixedLength = String(step).includes('.')
                ? Number(String(step).split('.')[1].length)
                : undefined;
            processChange(String(fixedLength ? newValue.toFixed(fixedLength) : newValue).replace('.', decimalSeparator));
        }
        onKeyDown && onKeyDown(event);
    };
    /**
     * Handle key up event
     *
     * Move cursor if there is a suffix to prevent user typing past suffix
     */
    const handleOnKeyUp = (event) => {
        const { key, currentTarget: { selectionStart }, } = event;
        if (key !== 'ArrowUp' && key !== 'ArrowDown' && stateValue !== '-') {
            const suffix = utils_1.getSuffix(stateValue, { groupSeparator, decimalSeparator });
            if (suffix && selectionStart && selectionStart > stateValue.length - suffix.length) {
                if (inputRef && typeof inputRef === 'object' && inputRef.current) {
                    const newCursor = stateValue.length - suffix.length;
                    inputRef.current.setSelectionRange(newCursor, newCursor);
                }
            }
        }
        onKeyUp && onKeyUp(event);
    };
    /* istanbul ignore next */
    react_1.useEffect(() => {
        // prevent cursor jumping if editing value
        if (dirty &&
            stateValue !== '-' &&
            inputRef &&
            typeof inputRef === 'object' &&
            inputRef.current) {
            inputRef.current.setSelectionRange(cursor, cursor);
        }
    }, [stateValue, cursor, inputRef, dirty]);
    /**
     * If user has only entered "-" or decimal separator,
     * keep the char to allow them to enter next value
     */
    const getRenderValue = () => {
        if (userValue !== undefined &&
            userValue !== null &&
            stateValue !== '-' &&
            stateValue !== decimalSeparator) {
            return utils_1.formatValue(Object.assign(Object.assign({}, formatValueOptions), { decimalScale: dirty ? undefined : decimalScale, value: String(userValue) }));
        }
        return stateValue;
    };
    const inputProps = Object.assign({ type: 'text', inputMode: 'decimal', id,
        name,
        className, onChange: handleOnChange, onBlur: handleOnBlur, onFocus: handleOnFocus, onKeyDown: handleOnKeyDown, onKeyUp: handleOnKeyUp, placeholder,
        disabled, value: getRenderValue(), ref: inputRef }, props);
    if (customInput) {
        const CustomInput = customInput;
        return react_1.default.createElement(CustomInput, Object.assign({}, inputProps));
    }
    return react_1.default.createElement("input", Object.assign({}, inputProps));
});
exports.CurrencyInput.displayName = 'CurrencyInput';
exports.default = exports.CurrencyInput;
