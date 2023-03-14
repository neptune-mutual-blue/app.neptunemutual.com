export const getReplacedString = (
  stringWithPlaceholders = '',
  replacements
) => {
  const str = stringWithPlaceholders.replace(
    /{\w+}/g,
    (placeholder) => {
      const value = replacements[placeholder.substring(1, placeholder.length - 1)]

      if (typeof value === 'undefined') {
        return placeholder
      }

      return value
    }

  )

  return str
}

export const toStringSafe = (x = '') => {
  try {
    return x.toString().trim().toLowerCase()
  } catch (error) {
    return ''
  }
}
