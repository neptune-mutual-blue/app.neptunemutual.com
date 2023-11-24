type RepositionCursorProps = {
    selectionStart?: number | null;
    value: string;
    lastKeyStroke: string | null;
    stateValue?: string;
    groupSeparator?: string;
};
/**
 * Based on the last key stroke and the cursor position, update the value
 * and reposition the cursor to the right place
 */
export declare const repositionCursor: ({ selectionStart, value, lastKeyStroke, stateValue, groupSeparator, }: RepositionCursorProps) => {
    modifiedValue: string;
    cursorPosition: number | null | undefined;
};
export {};
