import * as api from '@/src/services/api/config'
import { getReplacedString } from '@/utils/string'

export const readFromIpfs = async (ipfsHash) => {
  const url = getReplacedString(api.READ_IPFS_URL, { ipfsHash })

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        siteId: process.env.NEXT_PUBLIC_SITE_ID
      }
    })

    if (!response.ok) { return }

    const data = await response.json()

    if (data.data && Object.keys(data.data).length) {
      return data.data
    }
  } catch (error) {
    console.error(`Error in reading from ${url}: ${error}`)
  }
}
