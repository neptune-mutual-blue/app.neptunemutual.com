const { testData } = require('@/utils/unit-tests/test-data')

const mockGlobals = {
  ethereum: (overrides = { isMetaMask: true }) => {
    const ETHEREUM_METHODS = {
      eth_requestAccounts: () => [testData.account.account]
    }

    global.ethereum = {
      enable: jest.fn(() => Promise.resolve(true)),
      send: jest.fn((method) => {
        if (method === 'eth_chainId') {
          return Promise.resolve(1)
        }

        if (method === 'eth_requestAccounts') {
          return Promise.resolve(testData.account.account)
        }

        return Promise.resolve(true)
      }),
      request: jest.fn(async ({ method }) => {
        if (Object.prototype.hasOwnProperty.call(ETHEREUM_METHODS, method)) {
          return ETHEREUM_METHODS[method]
        }

        return ''
      }),
      on: jest.fn(() => {}),
      ...overrides
    }

    return global.ethereum
  },
  crypto: () => {
    // @ts-ignore
    global.crypto = {
      getRandomValues: jest.fn().mockReturnValueOnce(new Uint32Array(10))
    }
  },
  scrollTo: () => {
    global.scrollTo = jest.fn(() => {})
  },
  location: () => {
    global.location = {
      ancestorOrigins: null,
      hash: null,
      host: 'dummy.com',
      port: '80',
      protocol: 'http:',
      hostname: 'dummy.com',
      href: 'http://dummy.com?page=1&name=testing',
      origin: 'http://dummy.com',
      pathname: null,
      search: null,
      assign: null,
      reload: null,
      replace: null
    }
  },
  resizeObserver: () => {
    global.ResizeObserver = class ResizeObserver {
      constructor (cb) {
        this.cb = cb
      }

      observe () {
        this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }])
      }

      unobserve () {}
    }
  },
  DOMRect: () => {
    global.DOMRect = {
      fromRect: () => ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        toJSON: () => {}
      })
    }
  },
  console: {
    error: () => {
      const originalError = console.error
      const mockConsoleError = jest.fn()

      return {
        mock: () => {
          Object.defineProperty(global.console, 'error', {
            value: mockConsoleError
          })
        },
        restore: () => {
          Object.defineProperty(global.console, 'error', {
            value: originalError
          })
        },
        mockFunction: mockConsoleError
      }
    },
    dir: () => (console.dir = jest.fn(() => {})),
    log: () => {
      const originalLog = console.log
      const mockConsoleLog = jest.fn()

      return {
        mock: () => {
          Object.defineProperty(global.console, 'log', {
            value: mockConsoleLog
          })
        },
        restore: () => {
          Object.defineProperty(global.console, 'log', {
            value: originalLog
          })
        },
        mockFunction: mockConsoleLog
      }
    }
  },
  fetch: (
    resolve = true,
    fetchResponse = testData.fetch,
    fetchJsonData = {}
  ) => {
    global.fetch = jest.fn(() =>
      resolve
        ? Promise.resolve({
          ...fetchResponse,
          json: () => Promise.resolve(fetchJsonData)
        })
        : Promise.reject(fetchJsonData ?? 'Error occurred')
    )
    return {
      unmock: () => {
        if (global.fetch?.mockClear) {
          global.fetch?.mockClear?.()
          delete global.fetch
        }
      }
    }
  },
  setTimeout: () => {
    global.setTimeout = jest.fn((cb, timeout) => {
      jest.useFakeTimers()
      jest.advanceTimersByTime(timeout)
      cb()
    })
  },
  setInterval: () => {
    global.setInterval = jest.fn((cb, timeInterval) => {
      jest.useFakeTimers()
      jest.advanceTimersByTime(timeInterval)
      cb()
      return 1234
    })
  }
}

export { mockGlobals }
