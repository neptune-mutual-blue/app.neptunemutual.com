export var padTrimValue = function (value, decimalSeparator, decimalScale) {
    if (decimalSeparator === void 0) { decimalSeparator = '.'; }
    if (decimalScale === undefined || value === '' || value === undefined) {
        return value;
    }
    if (!value.match(/\d/g)) {
        return '';
    }
    var _a = value.split(decimalSeparator), int = _a[0], decimals = _a[1];
    if (decimalScale === 0) {
        return int;
    }
    var newValue = decimals || '';
    if (newValue.length < decimalScale) {
        while (newValue.length < decimalScale) {
            newValue += '0';
        }
    }
    else {
        newValue = newValue.slice(0, decimalScale);
    }
    return "".concat(int).concat(decimalSeparator).concat(newValue);
};
//# sourceMappingURL=padTrimValue.js.map