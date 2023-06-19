/* eslint-disable prefer-regex-literals */
export const isNumber = (input) => { return RegExp(/\d/, 'gi').test(input) }
