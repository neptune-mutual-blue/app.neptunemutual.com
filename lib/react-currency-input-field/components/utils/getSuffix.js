import { escapeRegExp } from './escapeRegExp';
export var getSuffix = function (value, _a) {
    var _b = _a.groupSeparator, groupSeparator = _b === void 0 ? ',' : _b, _c = _a.decimalSeparator, decimalSeparator = _c === void 0 ? '.' : _c;
    var suffixReg = new RegExp("\\d([^".concat(escapeRegExp(groupSeparator)).concat(escapeRegExp(decimalSeparator), "0-9]+)"));
    var suffixMatch = value.match(suffixReg);
    return suffixMatch ? suffixMatch[1] : undefined;
};
//# sourceMappingURL=getSuffix.js.map