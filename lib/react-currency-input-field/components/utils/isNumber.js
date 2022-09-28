/* eslint-disable prefer-regex-literals */
export const isNumber = (input) => RegExp(/\d/, 'gi').test(input)
