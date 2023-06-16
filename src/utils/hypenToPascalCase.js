function hyphenToPascalCase (str) {
  // Split the string into an array of words using the hyphen as a delimiter
  const words = str.split('-')

  // Capitalize the first letter of each word and join them with spaces
  const capitalizedWords = words.map(
    (word) => { return word.charAt(0).toUpperCase() + word.slice(1) }
  )
  const pascalCaseStr = capitalizedWords.join(' ')

  return pascalCaseStr
}

export { hyphenToPascalCase }
