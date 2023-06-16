export const mergeAlternatively = (arr1, arr2, filter) => {
  const maxLength = arr1.length > arr2.length ? arr1.length : arr2.length

  const merged = []

  for (let i = 0; i < maxLength; i++) {
    const leftEl = arr1[i] || filter
    const rightEl = arr2[i] || filter

    merged.push(leftEl, rightEl)
  }

  return merged
}

export const chunk = (size, arr = []) => {
  return arr.reduce(
    (segments, _, index) => {
      return index % size === 0
        ? [...segments, arr.slice(index, index + size)]
        : segments
    },
    []
  )
}
