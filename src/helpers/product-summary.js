import { isValidProduct } from '@/src/helpers/cover'

// Returned value can be
// dedicated cover
// diversified cover
// product of diversified cover
const getCoverOrProduct = (summaryData = [], coverKey, productKey) => {
  return summaryData.find(x => {
    const isSameProductKey = isValidProduct(productKey) ? x.productKey === productKey : x.productKey === null

    return x.coverKey === coverKey && isSameProductKey
  })
}

// Get dedicated covers
const getDedicatedCovers = (summaryData = []) => {
  return summaryData.filter(x => { return !x.productKey && !x.supportsProducts })
}

// Get diversified covers
const getDiversifiedCovers = (summaryData = []) => {
  return summaryData.filter(x => { return !x.productKey && x.supportsProducts })
}

// Get all covers
const getAllCovers = (summaryData = []) => {
  return summaryData.filter(x => { return !x.productKey })
}

// Get dedicated covers and products of diverisified covers
const getAllProducts = (summaryData = []) => {
  return summaryData.filter(x => { return x.productKey || !x.supportsProducts })
}

const getCoverByCoverKey = (summaryData = [], coverKey) => {
  return summaryData.find(x => { return x.coverKey === coverKey && !x.productKey })
}

const getProductsByCoverKey = (summaryData = [], coverKey) => {
  return summaryData.filter(x => { return x.coverKey === coverKey && x.productKey })
}

const getProduct = (summaryData = [], coverKey, productKey) => {
  return summaryData.find(x => { return x.coverKey === coverKey && x.productKey === productKey })
}

export const summaryHelpers = {
  getCoverOrProduct,
  getDedicatedCovers,
  getDiversifiedCovers,
  getAllCovers,
  getAllProducts,
  getCoverByCoverKey,
  getProductsByCoverKey,
  getProduct
}
