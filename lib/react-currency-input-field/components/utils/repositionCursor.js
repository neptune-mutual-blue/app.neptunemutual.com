/**
 * Based on the last key stroke and the cursor position, update the value
 * and reposition the cursor to the right place
 */
export var repositionCursor = function (_a) {
    var selectionStart = _a.selectionStart, value = _a.value, lastKeyStroke = _a.lastKeyStroke, stateValue = _a.stateValue, groupSeparator = _a.groupSeparator;
    var cursorPosition = selectionStart;
    var modifiedValue = value;
    if (stateValue && cursorPosition) {
        var splitValue = value.split('');
        // if cursor is to right of groupSeparator and backspace pressed, delete the character to the left of the separator and reposition the cursor
        if (lastKeyStroke === 'Backspace' && stateValue[cursorPosition] === groupSeparator) {
            splitValue.splice(cursorPosition - 1, 1);
            cursorPosition -= 1;
        }
        // if cursor is to left of groupSeparator and delete pressed, delete the character to the right of the separator and reposition the cursor
        if (lastKeyStroke === 'Delete' && stateValue[cursorPosition] === groupSeparator) {
            splitValue.splice(cursorPosition, 1);
            cursorPosition += 1;
        }
        modifiedValue = splitValue.join('');
        return { modifiedValue: modifiedValue, cursorPosition: cursorPosition };
    }
    return { modifiedValue: modifiedValue, cursorPosition: selectionStart };
};
//# sourceMappingURL=repositionCursor.js.map