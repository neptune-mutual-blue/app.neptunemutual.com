
const { getGraphURL } = require('@/src/config/environment')

const query = `
{
  covers {
    coverKey
    products {
      productKey
    }
  }
}
`

const getCoversAndProductsNames = async (networkId) => {
  if (!networkId) { return [] }

  const url = getGraphURL(networkId)

  if (!url) { return [] }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query
      })
    })

    const { data, errors } = await res.json()

    if (!errors) {
      return data.covers
    }
  } catch {}

  return []
}

export { getCoversAndProductsNames }
