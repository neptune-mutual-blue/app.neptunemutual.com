import {
  IPFS_DISPUTE_INFO_URL,
  IPFS_REPORT_INFO_URL,
  READ_IPFS_URL
} from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'
import { config } from '@neptunemutual/sdk'

const urls = {
  report: IPFS_REPORT_INFO_URL,
  dispute: IPFS_DISPUTE_INFO_URL
}

const getPermalink = (type, networkId, data) => {
  const { hostname } = config.networks.getChainConfig(networkId)

  if (type === 'report') {
    return `https://${hostname}/reports/${data.coverKey}/products/${data.productKey}`
  }

  if (type === 'dispute') {
    return `https://${hostname}/reports/${data.coverKey}/products/${data.productKey}/incidents/${data.incidentDate.toString()}`
  }
}

const writeToIpfs = async ({ payload, account, networkId, type, data }) => {
  const url = urls[type]

  if (!url) { return }

  const permalink = getPermalink(type, networkId, data)
  const _payload = {
    ...payload,
    createdBy: account,
    permalink
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(_payload),
      headers: {
        'Content-Type': 'application/json',
        siteId: process.env.NEXT_PUBLIC_SITE_ID
      }
    })

    if (!response.ok) { return }

    const res = await response.json()

    const hash = res?.data?.hash

    return hash
  } catch (error) {
    console.error(`Error in uploading ${type} data to ipfs: ${error}`)
  }
}

const readFromIpfs = async (ipfsHash) => {
  const url = getReplacedString(READ_IPFS_URL, { ipfsHash })

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        siteId: process.env.NEXT_PUBLIC_SITE_ID
      }
    })

    if (!response.ok) { return }

    const data = await response.json()

    if (data.data && Object.keys(data.data).length) { return data.data }
  } catch (error) {
    console.error(`Error in reading from ${url}: ${error}`)
  }
}

export { readFromIpfs, writeToIpfs }
