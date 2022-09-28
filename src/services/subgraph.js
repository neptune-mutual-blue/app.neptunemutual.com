import { getGraphURL } from '@/src/config/environment'

export async function getSubgraphData (networkId, query) {
  if (!networkId) {
    return null
  }

  const graphURL = getGraphURL(networkId)

  if (!graphURL) {
    return null
  }

  const response = await fetch(graphURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query: query
    })
  })

  if (!response.ok) {
    return null
  }

  const result = await response.json()

  if (result.errors) {
    return null
  }

  return result.data
}
