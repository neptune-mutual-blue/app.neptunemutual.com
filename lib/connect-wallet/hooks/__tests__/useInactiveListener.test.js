import { testData } from '@/utils/unit-tests/test-data'
import { renderHook } from '@testing-library/react-hooks'
import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { useInactiveListener } from '../useInactiveListener'
import { ACTIVE_CONNECTOR_KEY } from '@/lib/connect-wallet/config/localstorage'
import { ConnectorNames } from '@/lib/connect-wallet/config/connectors'
import { delay } from '@/utils/unit-tests/test-utils'

jest.mock('../../utils/connectors', () => ({
  getConnectorByName: async (name, chainId) => {
    const c = await import('../../injected/connector')

    return c.getConnector(chainId)
  }
}))

describe('useInactiveListener', () => {
  const notify = jest.fn()
  test('Connect to Injected', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new Error())
    })
    const deactivate = jest.fn()

    const ethereum = {
      on: jest.fn((event, cb) => {
        if (event === 'chainChanged') {
          return cb(testData.network.networkId)
        }

        return cb([testData.account])
      }),
      removeListener: jest.fn()
    }
    const auth = {
      login: jest.fn(),
      logout: jest.fn()
    }
    mockFn.useAuth(() => auth)

    mockFn.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate,
      error: false,
      active: false
    }))

    global.ethereum = ethereum
    window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, ConnectorNames.Injected)

    renderHook(() => useInactiveListener(testData.network.networkId, notify))

    await delay(100)

    expect(auth.login).toBeCalled()
    expect(auth.logout).toBeCalled()
  })

  test('Connect to Injected with changed network', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new Error())
    })
    const deactivate = jest.fn()

    const ethereum = {
      on: jest.fn((event, cb) => {
        if (event === 'chainChanged') {
          return cb(testData.network.networkId + 1)
        }

        return cb([testData.account])
      }),
      removeListener: jest.fn()
    }
    const auth = {
      login: jest.fn(),
      logout: jest.fn()
    }
    mockFn.useAuth(() => auth)

    mockFn.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate,
      error: false,
      active: false
    }))

    global.ethereum = ethereum
    window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, ConnectorNames.Injected)

    renderHook(() => useInactiveListener(testData.network.networkId, notify))

    await delay(100)

    expect(auth.login).toBeCalled()
    expect(auth.logout).toBeCalled()
  })

  test('Connect to BSC', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new Error())
    })
    const deactivate = jest.fn()

    const BinanceChain = {
      on: jest.fn((event, cb) => {
        if (event === 'chainChanged') {
          return cb(testData.network.networkId)
        }

        return cb([testData.account])
      }),
      removeListener: jest.fn()
    }
    const auth = {
      login: jest.fn(),
      logout: jest.fn()
    }
    mockFn.useAuth(() => auth)

    mockFn.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate,
      active: false,
      error: false
    }))

    global.BinanceChain = BinanceChain
    window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, ConnectorNames.BSC)

    renderHook(() => useInactiveListener(testData.network.networkId, notify))

    await delay(100)

    expect(auth.login).toBeCalled()
    expect(auth.logout).toBeCalled()
  })
})
