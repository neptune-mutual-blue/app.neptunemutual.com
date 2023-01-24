export const delay = (value) => new Promise((resolve) => {
  setTimeout(() => resolve(value), 5000)
})
