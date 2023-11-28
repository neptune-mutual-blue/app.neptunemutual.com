export var fixedDecimalValue = function (value, decimalSeparator, fixedDecimalLength) {
    if (fixedDecimalLength !== undefined && value.length > 1) {
        if (fixedDecimalLength === 0) {
            return value.replace(decimalSeparator, '');
        }
        if (value.includes(decimalSeparator)) {
            var _a = value.split(decimalSeparator), int = _a[0], decimals = _a[1];
            if (decimals.length === fixedDecimalLength) {
                return value;
            }
            if (decimals.length > fixedDecimalLength) {
                return "".concat(int).concat(decimalSeparator).concat(decimals.slice(0, fixedDecimalLength));
            }
        }
        var reg = value.length > fixedDecimalLength
            ? new RegExp("(\\d+)(\\d{".concat(fixedDecimalLength, "})"))
            : new RegExp("(\\d)(\\d+)");
        var match = value.match(reg);
        if (match) {
            var int = match[1], decimals = match[2];
            return "".concat(int).concat(decimalSeparator).concat(decimals);
        }
    }
    return value;
};
//# sourceMappingURL=fixedDecimalValue.js.map