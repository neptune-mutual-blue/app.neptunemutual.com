import { testData } from '@/utils/unit-tests/test-data'
import { delay } from '@/utils/unit-tests/test-utils'
import { renderHook } from '@testing-library/react-hooks'
import useAuth from '../useAuth'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

jest.mock('../../utils/connectors', () => ({
  getConnectorByName: async (name, chainId) => {
    const c = await import('../../injected/connector')

    return c.getConnector(chainId)
  }
}))

describe('useAuth with custom Connector name', () => {
  const notify = jest.fn()
  test('Connect to Injected with common Error', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new Error())
    })
    const deactivate = jest.fn()
    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate
    }))
    const { result } = renderHook(() =>
      useAuth(testData.network.networkId, notify)
    )

    await result.current.login('UNKNOWN')

    await delay(110)
    expect(activate).toBeCalled()
  })
})
