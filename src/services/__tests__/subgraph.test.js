import { getGraphURL } from '@/src/config/environment'
/* eslint-disable no-global-assign */
import { getSubgraphData } from '@/src/services/subgraph'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('getSubgraphData test', () => {
  describe('Scenarios where getSubgraphData returned null', () => {
    test('Should return null when no networkId is passed', async () => {
      const data = await getSubgraphData()
      expect(data).toBe(null)
    })

    test('Should return null when no graphURL found', async () => {
      mockHooksOrMethods.getGraphURL(null, true)
      const data = await getSubgraphData('invalid')
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
      const responseData = { data: { test: 'test' } }

      mockHooksOrMethods.getGraphURL()
      mockGlobals.fetch(true, undefined, responseData)

      const data = await getSubgraphData('valid', {})
      expect(data).toEqual(responseData.data)
    })

    test('Should return null when reponse is not ok', async () => {
      mockHooksOrMethods.getGraphURL()

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: true }),
          ok: false
        })
      )

      const data = await getSubgraphData('valid', {})
      expect(data).toBe(null)
    })

    test("Should return null when there's an error", async () => {
      mockHooksOrMethods.getGraphURL()

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ errors: true }),
          ok: true
        })
      )

      const data = await getSubgraphData('valid', {})
      expect(data).toBe(null)
    })
  })
})
