const { FALLBACK_NPM_TOKEN_SYMBOL, FALLBACK_LIQUIDITY_TOKEN_DECIMALS, FALLBACK_LIQUIDITY_TOKEN_SYMBOL, FALLBACK_NPM_TOKEN_DECIMALS } = require('@/src/config/constants')
const Addresses = require('@/src/services/contracts/getAddresses')
const { contracts } = require('@/utils/unit-tests/data/mockUpdata.data')

const { getAddressesFromApi } = Addresses

const { value: NPMTokenAddress } = contracts.data.find(
  (item) => item.key === 'NPM'
)
const { value: liquidityTokenAddress } = contracts.data.find(
  (item) => item.key === 'Stablecoin'
)

describe('Addresses test', () => {
  describe('getTokenSymbolAndDecimals test', () => {})

  describe('getAddressesFromApi test', () => {
    test('get address', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            data: {
              contracts: [
                { key: 'NPM', value: '0x001ffb65ff6e15902072c5133c016fd89cb56a7e' },
                { key: 'Stablecoin', value: '0x76061c192fbbbf210d2da25d4b8aaa34b798ccab' }
              ]
            }
          }),
          ok: true
        })
      )

      const result = await getAddressesFromApi(
        process.env.NEXT_PUBLIC_FALLBACK_NETWORK
      )

      const expected = {
        NPMTokenAddress,
        liquidityTokenAddress,
        NPMTokenDecimals: FALLBACK_NPM_TOKEN_DECIMALS,
        NPMTokenSymbol: FALLBACK_NPM_TOKEN_SYMBOL,
        liquidityTokenDecimals: FALLBACK_LIQUIDITY_TOKEN_DECIMALS,
        liquidityTokenSymbol: FALLBACK_LIQUIDITY_TOKEN_SYMBOL
      }

      expect(result).toStrictEqual(expected)
    })

    test('get address return null because off reponse ok false', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: true }),
          ok: false
        })
      )
      const result = await getAddressesFromApi(
        process.env.NEXT_PUBLIC_FALLBACK_NETWORK
      )

      expect(result).toBe(null)
    })

    test('get address return null because api throws an error', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('error')))
      const result = await getAddressesFromApi(
        process.env.NEXT_PUBLIC_FALLBACK_NETWORK
      )

      expect(result).toBe(null)
    })
  })
})
