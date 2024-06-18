"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyInput = void 0;
const react_1 = __importStar(require("react"));
const utils_1 = require("./utils");
exports.CurrencyInput = (0, react_1.forwardRef)(({ allowDecimals = true, allowNegativeValue = true, id, name, className, customInput, decimalsLimit, defaultValue, disabled = false, maxLength: userMaxLength, value: userValue, onValueChange, fixedDecimalLength, placeholder, decimalScale, prefix, suffix, intlConfig, step, min, max, disableGroupSeparators = false, disableAbbreviations = false, decimalSeparator: _decimalSeparator, groupSeparator: _groupSeparator, onChange, onFocus, onBlur, onKeyDown, onKeyUp, transformRawValue, ...props }, ref) => {
    if (_decimalSeparator && (0, utils_1.isNumber)(_decimalSeparator)) {
        throw new Error('decimalSeparator cannot be a number');
    }
    if (_groupSeparator && (0, utils_1.isNumber)(_groupSeparator)) {
        throw new Error('groupSeparator cannot be a number');
    }
    const localeConfig = (0, react_1.useMemo)(() => (0, utils_1.getLocaleConfig)(intlConfig), [intlConfig]);
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
        ? (0, utils_1.formatValue)({ ...formatValueOptions, decimalScale, value: String(defaultValue) })
        : userValue !== undefined && userValue !== null
            ? (0, utils_1.formatValue)({ ...formatValueOptions, decimalScale, value: String(userValue) })
            : '';
    const [stateValue, setStateValue] = (0, react_1.useState)(formattedStateValue);
    const [dirty, setDirty] = (0, react_1.useState)(false);
    const [cursor, setCursor] = (0, react_1.useState)(0);
    const [changeCount, setChangeCount] = (0, react_1.useState)(0);
    const [lastKeyStroke, setLastKeyStroke] = (0, react_1.useState)(null);
    const inputRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => inputRef.current);
    /**
     * Process change in value
     */
    const processChange = (value, selectionStart) => {
        setDirty(true);
        const { modifiedValue, cursorPosition } = (0, utils_1.repositionCursor)({
            selectionStart,
            value,
            lastKeyStroke,
            stateValue,
            groupSeparator,
        });
        const stringValue = (0, utils_1.cleanValue)({ value: modifiedValue, ...cleanValueOptions });
        if (userMaxLength && stringValue.replace(/-/g, '').length > userMaxLength) {
            return;
        }
        if (stringValue === '' || stringValue === '-' || stringValue === decimalSeparator) {
            onValueChange && onValueChange(undefined, name, { float: null, formatted: '', value: '' });
            setStateValue(stringValue);
            // Always sets cursor after '-' or decimalSeparator input
            setCursor(1);
            return;
        }
        const stringValueWithoutSeparator = decimalSeparator
            ? stringValue.replace(decimalSeparator, '.')
            : stringValue;
        const numberValue = parseFloat(stringValueWithoutSeparator);
        const formattedValue = (0, utils_1.formatValue)({
            value: stringValue,
            ...formatValueOptions,
        });
        if (cursorPosition !== undefined && cursorPosition !== null) {
            // Prevent cursor jumping
            let newCursor = cursorPosition + (formattedValue.length - value.length);
            newCursor = newCursor <= 0 ? (prefix ? prefix.length : 0) : newCursor;
            setCursor(newCursor);
            setChangeCount(changeCount + 1);
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
        const valueOnly = (0, utils_1.cleanValue)({ value, ...cleanValueOptions });
        if (valueOnly === '-' || valueOnly === decimalSeparator || !valueOnly) {
            setStateValue('');
            onBlur && onBlur(event);
            return;
        }
        const fixedDecimals = (0, utils_1.fixedDecimalValue)(valueOnly, decimalSeparator, fixedDecimalLength);
        const newValue = (0, utils_1.padTrimValue)(fixedDecimals, decimalSeparator, decimalScale !== undefined ? decimalScale : fixedDecimalLength);
        const numberValue = parseFloat(newValue.replace(decimalSeparator, '.'));
        const formattedValue = (0, utils_1.formatValue)({
            ...formatValueOptions,
            value: newValue,
        });
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
        setLastKeyStroke(key);
        if (step && (key === 'ArrowUp' || key === 'ArrowDown')) {
            event.preventDefault();
            setCursor(stateValue.length);
            const currentValue = parseFloat(userValue !== undefined && userValue !== null
                ? String(userValue).replace(decimalSeparator, '.')
                : (0, utils_1.cleanValue)({ value: stateValue, ...cleanValueOptions })) || 0;
            const newValue = key === 'ArrowUp' ? currentValue + step : currentValue - step;
            if (min !== undefined && newValue < Number(min)) {
                return;
            }
            if (max !== undefined && newValue > Number(max)) {
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
            const suffix = (0, utils_1.getSuffix)(stateValue, { groupSeparator, decimalSeparator });
            if (suffix && selectionStart && selectionStart > stateValue.length - suffix.length) {
                /* istanbul ignore else */
                if (inputRef.current) {
                    const newCursor = stateValue.length - suffix.length;
                    inputRef.current.setSelectionRange(newCursor, newCursor);
                }
            }
        }
        onKeyUp && onKeyUp(event);
    };
    (0, react_1.useEffect)(() => {
        // prevent cursor jumping if editing value
        if (dirty &&
            stateValue !== '-' &&
            inputRef.current &&
            document.activeElement === inputRef.current) {
            inputRef.current.setSelectionRange(cursor, cursor);
        }
    }, [stateValue, cursor, inputRef, dirty, changeCount]);
    /**
     * If user has only entered "-" or decimal separator,
     * keep the char to allow them to enter next value
     */
    const getRenderValue = () => {
        if (userValue !== undefined &&
            userValue !== null &&
            stateValue !== '-' &&
            (!decimalSeparator || stateValue !== decimalSeparator)) {
            return (0, utils_1.formatValue)({
                ...formatValueOptions,
                decimalScale: dirty ? undefined : decimalScale,
                value: String(userValue),
            });
        }
        return stateValue;
    };
    const inputProps = {
        type: 'text',
        inputMode: 'decimal',
        id,
        name,
        className,
        onChange: handleOnChange,
        onBlur: handleOnBlur,
        onFocus: handleOnFocus,
        onKeyDown: handleOnKeyDown,
        onKeyUp: handleOnKeyUp,
        placeholder,
        disabled,
        value: getRenderValue(),
        ref: inputRef,
        ...props,
    };
    if (customInput) {
        const CustomInput = customInput;
        return <CustomInput {...inputProps}/>;
    }
    return <input {...inputProps}/>;
});
exports.CurrencyInput.displayName = 'CurrencyInput';
exports.default = exports.CurrencyInput;
//# sourceMappingURL=CurrencyInput.jsx.map