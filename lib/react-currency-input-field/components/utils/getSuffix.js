import { escapeRegExp } from './escapeRegExp'

export const getSuffix = (
  value,
  { groupSeparator = ',', decimalSeparator = '.' }
) => {
  const suffixReg = new RegExp(
    `\\d([^${escapeRegExp(groupSeparator)}${escapeRegExp(
      decimalSeparator
    )}0-9]+)`
  )
  const suffixMatch = value.match(suffixReg)
  return suffixMatch ? suffixMatch[1] : undefined
}
