import {
  parseBytes32String,
  formatBytes32String
} from '@ethersproject/strings'

export const safeParseBytes32String = (bytes32String) => {
  try {
    return parseBytes32String(bytes32String)
  } catch (error) {
    return bytes32String
  }
}

export const safeFormatBytes32String = (str) => {
  try {
    return formatBytes32String(str)
  } catch (error) {
    return str
  }
}
