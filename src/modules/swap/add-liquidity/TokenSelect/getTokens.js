async function getTokens () {
  try {
    const url = '/swap/tokens.json'
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

export { getTokens }
