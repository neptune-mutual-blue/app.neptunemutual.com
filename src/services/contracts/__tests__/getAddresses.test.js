const { CHAINS, ChainConfig } = require('@/src/config/hardcoded')
const Addresses = require('@/src/services/contracts/getAddresses')
const { contracts } = require('@/utils/unit-tests/data/mockUpdata.data')

const { getAddressesFromApi } = Addresses

const { value: NPMTokenAddress } = contracts.data.find(
  (item) => { return item.key === 'NPM' }
)
const { value: liquidityTokenAddress } = contracts.data.find(
  (item) => { return item.key === 'Stablecoin' }
)

describe('Addresses test', () => {
  describe('getTokenSymbolAndDecimals test', () => {})

  describe('getAddressesFromApi test', () => {
    test('get address', async () => {
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          json: () => {
            return Promise.resolve({
              data: {
                contracts: [
                  { key: 'NPM', value: '0x001ffb65ff6e15902072c5133c016fd89cb56a7e' },
                  { key: 'Stablecoin', value: '0x76061c192fbbbf210d2da25d4b8aaa34b798ccab' }
                ]
              }
            })
          },
          ok: true
        })
      }
      )

      const result = await getAddressesFromApi(
        CHAINS.BASE_GOERLI
      )

      const expectedConfig = ChainConfig[CHAINS.BASE_GOERLI]

      const expected = {
        NPMTokenAddress,
        liquidityTokenAddress,
        NPMTokenDecimals: expectedConfig.npm.tokenDecimals,
        NPMTokenSymbol: expectedConfig.npm.tokenSymbol,
        liquidityTokenDecimals: expectedConfig.stablecoin.tokenDecimals,
        liquidityTokenSymbol: expectedConfig.stablecoin.tokenSymbol
      }

      expect(result).toStrictEqual(expected)
    })

    test('get address return null because off reponse ok false', async () => {
      global.fetch = jest.fn(() => {
        return Promise.resolve({
          json: () => { return Promise.resolve({ data: true }) },
          ok: false
        })
      }
      )
      const result = await getAddressesFromApi(
        CHAINS.BASE_GOERLI
      )

      expect(result).toBe(null)
    })

    test('get address return fallback because api throws an error', async () => {
      global.fetch = jest.fn(() => { return Promise.reject(new Error('error')) })
      const result = await getAddressesFromApi(
        CHAINS.BASE_GOERLI
      )

      const expectedConfig = ChainConfig[CHAINS.BASE_GOERLI]

      const expected = {
        NPMTokenAddress: expectedConfig.npm.address,
        liquidityTokenAddress: expectedConfig.stablecoin.address,
        NPMTokenDecimals: expectedConfig.npm.tokenDecimals,
        NPMTokenSymbol: expectedConfig.npm.tokenSymbol,
        liquidityTokenDecimals: expectedConfig.stablecoin.tokenDecimals,
        liquidityTokenSymbol: expectedConfig.stablecoin.tokenSymbol
      }

      expect(result).toStrictEqual(expected)
    })
  })
})
