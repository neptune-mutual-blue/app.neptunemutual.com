import { parseBytes32String } from '@ethersproject/strings'
import { utils } from '@neptunemutual/sdk'

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
