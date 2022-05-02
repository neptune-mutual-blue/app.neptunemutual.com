"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = void 0;
const isNumber = (input) => RegExp(/\d/, 'gi').test(input);
exports.isNumber = isNumber;
