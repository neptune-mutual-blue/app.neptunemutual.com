import { renderHook } from '@testing-library/react-hooks'
import { useEagerConnect } from '@/lib/connect-wallet/hooks/useEagerConnect'
import { testData } from '@/utils/unit-tests/test-data'
import { ACTIVE_CONNECTOR_KEY } from '@/lib/connect-wallet/config/localstorage'
import { ConnectorNames } from '@/lib/connect-wallet/config/connectors'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useEagerConnect test cases', () => {
  const notify = jest.fn()
  test('Connect to Injected', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    const auth = {
      login: jest.fn(),
      logout: jest.fn()
    }
    mockHooksOrMethods.useAuth(() => auth)

    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector
    }))

    window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, ConnectorNames.Injected)

    renderHook(() => useEagerConnect(testData.network.networkId, notify))

    expect(auth.login).toBeCalled()
  })

  test('Connect to BSC', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    const auth = {
      login: jest.fn(),
      logout: jest.fn()
    }
    mockHooksOrMethods.useAuth(() => auth)

    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector
    }))

    window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, ConnectorNames.BSC)

    renderHook(() => useEagerConnect(testData.network.networkId, notify))

    expect(auth.login).not.toBeCalled()
  })

  test('Connect to BSC with window.Binance', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    const auth = {
      login: jest.fn(),
      logout: jest.fn()
    }
    mockHooksOrMethods.useAuth(() => auth)

    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector
    }))

    global.BinanceChain = {
      bsc: 1
    }

    window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, ConnectorNames.BSC)

    renderHook(() => useEagerConnect(testData.network.networkId, notify))

    expect(auth.login).toBeCalled()
  })

  test('Connect to Unknown', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    const auth = {
      login: jest.fn(),
      logout: jest.fn()
    }
    mockHooksOrMethods.useAuth(() => auth)

    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector
    }))

    window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, '')

    renderHook(() => useEagerConnect(testData.network.networkId, notify))

    expect(auth.login).not.toBeCalled()
  })
})
