export function createRandomString (length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * length))
  }

  return result
}

export function createMockTableData ({ count = 3, fields = [] }) {
  return [...Array(count)].map((_) => {
    const objectValue = {}

    fields.forEach((field) => {
      objectValue[field] = createRandomString()
    })

    return objectValue
  })
}
