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
import React, { useState, useEffect, useRef, forwardRef, useMemo, useImperativeHandle, } from 'react';
import { isNumber, cleanValue, fixedDecimalValue, formatValue, getLocaleConfig, padTrimValue, getSuffix, repositionCursor, } from './utils';
export var CurrencyInput = forwardRef(function (_a, ref) {
    var _b = _a.allowDecimals, allowDecimals = _b === void 0 ? true : _b, _c = _a.allowNegativeValue, allowNegativeValue = _c === void 0 ? true : _c, id = _a.id, name = _a.name, className = _a.className, customInput = _a.customInput, decimalsLimit = _a.decimalsLimit, defaultValue = _a.defaultValue, _d = _a.disabled, disabled = _d === void 0 ? false : _d, userMaxLength = _a.maxLength, userValue = _a.value, onValueChange = _a.onValueChange, fixedDecimalLength = _a.fixedDecimalLength, placeholder = _a.placeholder, decimalScale = _a.decimalScale, prefix = _a.prefix, suffix = _a.suffix, intlConfig = _a.intlConfig, step = _a.step, min = _a.min, max = _a.max, _e = _a.disableGroupSeparators, disableGroupSeparators = _e === void 0 ? false : _e, _f = _a.disableAbbreviations, disableAbbreviations = _f === void 0 ? false : _f, _decimalSeparator = _a.decimalSeparator, _groupSeparator = _a.groupSeparator, onChange = _a.onChange, onFocus = _a.onFocus, onBlur = _a.onBlur, onKeyDown = _a.onKeyDown, onKeyUp = _a.onKeyUp, transformRawValue = _a.transformRawValue, props = __rest(_a, ["allowDecimals", "allowNegativeValue", "id", "name", "className", "customInput", "decimalsLimit", "defaultValue", "disabled", "maxLength", "value", "onValueChange", "fixedDecimalLength", "placeholder", "decimalScale", "prefix", "suffix", "intlConfig", "step", "min", "max", "disableGroupSeparators", "disableAbbreviations", "decimalSeparator", "groupSeparator", "onChange", "onFocus", "onBlur", "onKeyDown", "onKeyUp", "transformRawValue"]);
    if (_decimalSeparator && isNumber(_decimalSeparator)) {
        throw new Error('decimalSeparator cannot be a number');
    }
    if (_groupSeparator && isNumber(_groupSeparator)) {
        throw new Error('groupSeparator cannot be a number');
    }
    var localeConfig = useMemo(function () { return getLocaleConfig(intlConfig); }, [intlConfig]);
    var decimalSeparator = _decimalSeparator || localeConfig.decimalSeparator || '';
    var groupSeparator = _groupSeparator || localeConfig.groupSeparator || '';
    if (decimalSeparator &&
        groupSeparator &&
        decimalSeparator === groupSeparator &&
        disableGroupSeparators === false) {
        throw new Error('decimalSeparator cannot be the same as groupSeparator');
    }
    var formatValueOptions = {
        decimalSeparator: decimalSeparator,
        groupSeparator: groupSeparator,
        disableGroupSeparators: disableGroupSeparators,
        intlConfig: intlConfig,
        prefix: prefix || localeConfig.prefix,
        suffix: suffix,
    };
    var cleanValueOptions = {
        decimalSeparator: decimalSeparator,
        groupSeparator: groupSeparator,
        allowDecimals: allowDecimals,
        decimalsLimit: decimalsLimit || fixedDecimalLength || 2,
        allowNegativeValue: allowNegativeValue,
        disableAbbreviations: disableAbbreviations,
        prefix: prefix || localeConfig.prefix,
        transformRawValue: transformRawValue,
    };
    var formattedStateValue = defaultValue !== undefined && defaultValue !== null
        ? formatValue(__assign(__assign({}, formatValueOptions), { decimalScale: decimalScale, value: String(defaultValue) }))
        : userValue !== undefined && userValue !== null
            ? formatValue(__assign(__assign({}, formatValueOptions), { decimalScale: decimalScale, value: String(userValue) }))
            : '';
    var _g = useState(formattedStateValue), stateValue = _g[0], setStateValue = _g[1];
    var _h = useState(false), dirty = _h[0], setDirty = _h[1];
    var _j = useState(0), cursor = _j[0], setCursor = _j[1];
    var _k = useState(0), changeCount = _k[0], setChangeCount = _k[1];
    var _l = useState(null), lastKeyStroke = _l[0], setLastKeyStroke = _l[1];
    var inputRef = useRef(null);
    useImperativeHandle(ref, function () { return inputRef.current; });
    /**
     * Process change in value
     */
    var processChange = function (value, selectionStart) {
        setDirty(true);
        var _a = repositionCursor({
            selectionStart: selectionStart,
            value: value,
            lastKeyStroke: lastKeyStroke,
            stateValue: stateValue,
            groupSeparator: groupSeparator,
        }), modifiedValue = _a.modifiedValue, cursorPosition = _a.cursorPosition;
        var stringValue = cleanValue(__assign({ value: modifiedValue }, cleanValueOptions));
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
        var stringValueWithoutSeparator = decimalSeparator
            ? stringValue.replace(decimalSeparator, '.')
            : stringValue;
        var numberValue = parseFloat(stringValueWithoutSeparator);
        var formattedValue = formatValue(__assign({ value: stringValue }, formatValueOptions));
        if (cursorPosition !== undefined && cursorPosition !== null) {
            // Prevent cursor jumping
            var newCursor = cursorPosition + (formattedValue.length - value.length);
            newCursor = newCursor <= 0 ? (prefix ? prefix.length : 0) : newCursor;
            setCursor(newCursor);
            setChangeCount(changeCount + 1);
        }
        setStateValue(formattedValue);
        if (onValueChange) {
            var values = {
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
    var handleOnChange = function (event) {
        var _a = event.target, value = _a.value, selectionStart = _a.selectionStart;
        processChange(value, selectionStart);
        onChange && onChange(event);
    };
    /**
     * Handle focus event
     */
    var handleOnFocus = function (event) {
        onFocus && onFocus(event);
        return stateValue ? stateValue.length : 0;
    };
    /**
     * Handle blur event
     *
     * Format value by padding/trimming decimals if required by
     */
    var handleOnBlur = function (event) {
        var value = event.target.value;
        var valueOnly = cleanValue(__assign({ value: value }, cleanValueOptions));
        if (valueOnly === '-' || valueOnly === decimalSeparator || !valueOnly) {
            setStateValue('');
            onBlur && onBlur(event);
            return;
        }
        var fixedDecimals = fixedDecimalValue(valueOnly, decimalSeparator, fixedDecimalLength);
        var newValue = padTrimValue(fixedDecimals, decimalSeparator, decimalScale !== undefined ? decimalScale : fixedDecimalLength);
        var numberValue = parseFloat(newValue.replace(decimalSeparator, '.'));
        var formattedValue = formatValue(__assign(__assign({}, formatValueOptions), { value: newValue }));
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
    var handleOnKeyDown = function (event) {
        var key = event.key;
        setLastKeyStroke(key);
        if (step && (key === 'ArrowUp' || key === 'ArrowDown')) {
            event.preventDefault();
            setCursor(stateValue.length);
            var currentValue = parseFloat(userValue !== undefined && userValue !== null
                ? String(userValue).replace(decimalSeparator, '.')
                : cleanValue(__assign({ value: stateValue }, cleanValueOptions))) || 0;
            var newValue = key === 'ArrowUp' ? currentValue + step : currentValue - step;
            if (min !== undefined && newValue < Number(min)) {
                return;
            }
            if (max !== undefined && newValue > Number(max)) {
                return;
            }
            var fixedLength = String(step).includes('.')
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
    var handleOnKeyUp = function (event) {
        var key = event.key, selectionStart = event.currentTarget.selectionStart;
        if (key !== 'ArrowUp' && key !== 'ArrowDown' && stateValue !== '-') {
            var suffix_1 = getSuffix(stateValue, { groupSeparator: groupSeparator, decimalSeparator: decimalSeparator });
            if (suffix_1 && selectionStart && selectionStart > stateValue.length - suffix_1.length) {
                /* istanbul ignore else */
                if (inputRef.current) {
                    var newCursor = stateValue.length - suffix_1.length;
                    inputRef.current.setSelectionRange(newCursor, newCursor);
                }
            }
        }
        onKeyUp && onKeyUp(event);
    };
    useEffect(function () {
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
    var getRenderValue = function () {
        if (userValue !== undefined &&
            userValue !== null &&
            stateValue !== '-' &&
            (!decimalSeparator || stateValue !== decimalSeparator)) {
            return formatValue(__assign(__assign({}, formatValueOptions), { decimalScale: dirty ? undefined : decimalScale, value: String(userValue) }));
        }
        return stateValue;
    };
    var inputProps = __assign({ type: 'text', inputMode: 'decimal', id: id, name: name, className: className, onChange: handleOnChange, onBlur: handleOnBlur, onFocus: handleOnFocus, onKeyDown: handleOnKeyDown, onKeyUp: handleOnKeyUp, placeholder: placeholder, disabled: disabled, value: getRenderValue(), ref: inputRef }, props);
    if (customInput) {
        var CustomInput = customInput;
        return <CustomInput {...inputProps}/>;
    }
    return <input {...inputProps}/>;
});
CurrencyInput.displayName = 'CurrencyInput';
export default CurrencyInput;
//# sourceMappingURL=CurrencyInput.jsx.map