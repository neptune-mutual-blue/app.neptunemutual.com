import { getGraphURL } from '@/src/config/environment'
/* eslint-disable no-global-assign */
import { getSubgraphData } from '@/src/services/subgraph'

describe('getSubgraphData test', () => {
  describe('Scenarios where getSubgraphData returned null', () => {
    test('Should return null when no networkId is passed', async () => {
      const data = await getSubgraphData()
      expect(data).toBe(null)
    })

    test('Should return null when no graphURL found', async () => {
      const graphURL = jest.spyOn({ getGraphURL }, 'getGraphURL')
      const data = await getSubgraphData('invalid')
      expect(graphURL).toBeCalled()
      expect(data).toBe(null)
    })
  })

  describe('Fetching graphURL', () => {
    const globalOld = global
    const graphURL = jest.spyOn({ getGraphURL }, 'getGraphURL')

    beforeEach(() => {
      graphURL.mockImplementation(() => {
        return 'https://www.foo.com'
      })
    })

    afterEach(() => {
      global = globalOld
    })

    test('Should return proper data', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: true }),
          ok: true
        })
      )

      const data = await getSubgraphData('valid', {})
      expect(getGraphURL).toBeCalled()
      expect(data).toBe(true)
    })

    test('Should return null when reponse is not ok', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: true }),
          ok: false
        })
      )

      const data = await getSubgraphData('valid', {})
      expect(getGraphURL).toBeCalled()
      expect(data).toBe(null)
    })

    test("Should return null when there's an error", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ errors: true }),
          ok: true
        })
      )

      const data = await getSubgraphData('valid', {})
      expect(getGraphURL).toBeCalled()
      expect(data).toBe(null)
    })
  })
})
