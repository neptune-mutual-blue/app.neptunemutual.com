export const getTagFromTitle = (text) => {
  const [, , tag] = Array.from(text.match(/^(\[([a-zA-Z0-9]*)(-.*)?\])?/))
  return tag ? tag.toLowerCase() : ''
}
