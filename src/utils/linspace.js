function linspace (start, end, n) {
  const step = (end - start) / (n - 1)
  const arr = new Array(n)
  for (let i = 0; i < n; i++) {
    arr[i] = start + step * i
  }

  return arr
}

export { linspace }
