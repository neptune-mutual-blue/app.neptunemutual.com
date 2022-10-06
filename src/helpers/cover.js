import { utils } from '@neptunemutual/sdk'
import { parseBytes32String } from '@ethersproject/strings'

/**
 *
 * @param {Object} [coverData]
 * @param {string} coverData.key
 * @returns
 */
export const getCoverImgSrc = ({ key } = { key: '' }) => {
  try {
    return `/images/covers/${parseBytes32String(key)}.svg`
  } catch (error) {
    return '/images/covers/empty.svg'
  }
}

export const isValidProduct = (productKey) => {
  return (
    productKey &&
    productKey !== utils.keyUtil.toBytes32('') &&
    productKey !== '0x00000000'
  )
}

export const getParsedCoverInfo = async (ipfsStr = '', ipfsHash) => {
  try {
    let obj

    if (!ipfsStr) {
      obj = await utils.ipfs.read(ipfsHash)
    } else {
      obj = JSON.parse(ipfsStr)
    }

    return {
      coverName: obj.coverName,
      projectName: obj.projectName,
      leverage: obj.leverageFactor,
      tags: obj.tags,
      about: obj.about,
      blockchains: obj.blockchains,
      parameters: obj.parameters,
      exclusions: obj.exclusions,
      links: obj.links,
      pricingFloor: obj.floor,
      pricingCeiling: obj.ceiling,
      resolutionSources: obj.resolutionSources
    }
  } catch (error) {}

  return {
    coverName: '---',
    projectName: '---',
    leverage: '0',
    tags: [],
    blockchains: [],
    about: '---',
    parameters: '---',
    exclusions: '---',
    links: {},
    pricingFloor: '0',
    pricingCeiling: '0',
    resolutionSources: []
  }
}

export const getParsedProductInfo = async (ipfsStr = '', ipfsHash) => {
  try {
    let obj

    if (!ipfsStr) {
      obj = await utils.ipfs.read(ipfsHash)
    } else {
      obj = JSON.parse(ipfsStr)
    }

    return {
      productName: obj.productName,
      capitalEfficiency: obj.efficiency,
      tags: obj.tags,
      about: obj.about,
      parameters: obj.parameters,
      exclusions: obj.exclusions,
      links: obj.links,
      resolutionSources: obj.resolutionSources
    }
  } catch (error) {}

  return {
    productName: '---',
    tags: [],
    about: '---',
    parameters: '---',
    exclusions: '---',
    links: {},
    resolutionSources: []
  }
}
