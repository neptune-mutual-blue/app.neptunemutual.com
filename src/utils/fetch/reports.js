
const { getGraphURL } = require('@/src/config/environment')

const query = `
{
  incidentReports {
    coverKey
    productKey
    incidentDate
  }
}
`

const getIncidentReports = async (networkId) => {
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
      return data.incidentReports
    }
  } catch {}

  return []
}

export { getIncidentReports }
