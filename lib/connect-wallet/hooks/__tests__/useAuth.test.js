import { ConnectorNames } from '@/lib/connect-wallet/config/connectors'
import {
  UserRejectedRequestErrorInjected
} from '@/lib/connect-wallet/injected/errors'
import { testData } from '@/utils/unit-tests/test-data'
// import { NoEthereumProviderError } from '@web3-react/injected-connector'
import { delay } from '@/utils/unit-tests/test-utils'
// import { NoBscProviderError } from '@binance-chain/bsc-connector'
import { renderHook } from '@testing-library/react-hooks'
import { UnsupportedChainIdError } from '@web3-react/core'

import useAuth from '../useAuth'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const UNKNOWN_NETWORK = 'Unknown'
describe('Connect wallet Hooks', () => {
  const notify = jest.fn()

  test('should return default value', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector
    }))
    const { result } = renderHook(() =>
      useAuth(testData.network.networkId, notify)
    )

    expect(result.current).toHaveProperty('login')
    expect(typeof result.current.login).toBe('function')
    expect(result.current).toHaveProperty('logout')
    expect(typeof result.current.logout).toBe('function')
  })

  test('No Connector', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector: undefined
    }))
    renderHook(() => useAuth(testData.network.networkId, notify))

    expect(connector.addListener).not.toBeCalled()
  })

  test('With Connector', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn()
    const deactivate = jest.fn()

    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate
    }))
    renderHook(() => useAuth(testData.network.networkId, notify))

    expect(connector.addListener).toBeCalled()
  })

  test('Connect to Unknown', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    mockHooksOrMethods.useWeb3React(() => ({ ...testData.account, connector }))
    const { result } = renderHook(() =>
      useAuth(testData.network.networkId, notify)
    )

    const val = await result.current.login(UNKNOWN_NETWORK)

    expect(val).toBe(undefined)
  })

  test('Connect to Injected and login', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    const activate = jest.fn()
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

    await result.current.login(ConnectorNames.Injected)

    await delay(110)
    expect(activate).toBeCalled()
  })

  test('Connect to Injected and logoout', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }
    const activate = jest.fn()
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

    result.current.logout()

    await delay(110)
    expect(deactivate).toBeCalled()
  })

  test('Connect to Injected with Error', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new UnsupportedChainIdError(testData.network.networkId))
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

    await result.current.login(ConnectorNames.Injected)

    await delay(110)
    expect(activate).toBeCalled()
  })

  test('Connect to BSC with Error', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new UnsupportedChainIdError(testData.network.networkId))
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

    await result.current.login(ConnectorNames.BSC)

    await delay(110)
    expect(activate).toBeCalled()
  })

  test('Connect to Unknown Network with Error and no setup', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new UnsupportedChainIdError(testData.network.networkId))
    })
    const deactivate = jest.fn()
    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate
    }))
    const { result } = renderHook(() => useAuth(undefined, notify))

    await result.current.login(ConnectorNames.Injected)

    await delay(110)
    expect(activate).toBeCalled()
  })

  test('Connect to Injected with Error', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new Error('Sample Error'))
    })
    const deactivate = jest.fn()
    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate
    }))
    const { result } = renderHook(() => useAuth(undefined, notify))

    await result.current.login(ConnectorNames.Injected)

    await delay(110)
    expect(activate).toBeCalled()
  })

  test('Connect to BSC with Error', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new Error('Sample Error'))
    })
    const deactivate = jest.fn()
    mockHooksOrMethods.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate
    }))
    const { result } = renderHook(() => useAuth(undefined, notify))

    await result.current.login(ConnectorNames.BSC)

    await delay(110)
    expect(activate).toBeCalled()
  })

  // test('Connect to Injected with NoEthereumProviderError', async () => {
  //   const connector = {
  //     addListener: jest.fn(() => {}),
  //     removeListener: jest.fn(() => {})
  //   }

  //   const activate = jest.fn((name, cb) => {
  //     cb(new NoEthereumProviderError())
  //   })
  //   const deactivate = jest.fn()
  //   mockHooksOrMethods.useWeb3React(() => ({
  //     ...testData.account,
  //     connector,
  //     activate,
  //     deactivate
  //   }))
  //   const { result } = renderHook(() =>
  //     useAuth(testData.network.networkId, notify)
  //   )

  //   await result.current.login(ConnectorNames.Injected)

  //   await delay(110)
  //   expect(activate).toBeCalled()
  // })

  test('Connect to Injected with NoEthereumProviderError', async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {})
    }

    const activate = jest.fn((name, cb) => {
      cb(new UserRejectedRequestErrorInjected())
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

    await result.current.login(ConnectorNames.Injected)

    await delay(110)
    expect(activate).toBeCalled()
  })

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

    await result.current.login(ConnectorNames.Injected)

    await delay(110)
    expect(activate).toBeCalled()
  })

  // test('Connect to BSC with NoBscProviderError', async () => {
  //   const connector = {
  //     addListener: jest.fn(() => {}),
  //     removeListener: jest.fn(() => {})
  //   }

  //   const activate = jest.fn((name, cb) => {
  //     cb(new NoBscProviderError())
  //   })
  //   const deactivate = jest.fn()
  //   mockHooksOrMethods.useWeb3React(() => ({
  //     ...testData.account,
  //     connector,
  //     activate,
  //     deactivate
  //   }))
  //   const { result } = renderHook(() =>
  //     useAuth(testData.network.networkId, notify)
  //   )

  //   await result.current.login(ConnectorNames.BSC)

  //   await delay(110)
  //   expect(activate).toBeCalled()
  // })
})
