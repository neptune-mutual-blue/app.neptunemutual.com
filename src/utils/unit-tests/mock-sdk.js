import { testData } from '@/utils/unit-tests/test-data'
import * as mockNeptuneMutualSDK from '@neptunemutual/sdk'

const mockFn = (mockObject) => {
  jest.mock('@neptunemutual/sdk', () => ({
    ...mockNeptuneMutualSDK,
    ...mockObject
  }))
}

const mockSdk = {
  registry: {
    BondPool: {
      getInstance: () => {
        mockFn({
          registry: {
            BondPool: {
              getInstance: jest.fn(() =>
                Promise.resolve('geInstance() mock')
              )
            }
          }

        })
      },
      getAddress: () => {
        mockFn({
          registry: {
            BondPool: {
              getAddress: jest.fn(() =>
                Promise.resolve(testData.bondPoolAddress)
              )
            }
          }
        })
      }
    },
    Governance: {
      getInstance: () => {
        mockFn({
          registry: {
            Governance: {
              getInstance: jest.fn(() =>
                Promise.resolve('geInstance() mock')
              )
            }
          }
        })
      },
      getAddress: () => {
        mockFn({
          registry: {
            Governance: {
              getAddress: jest.fn(() =>
                Promise.resolve(testData.governanceAddress)
              )
            }
          }
        })
      }
    },
    IERC20: {
      getInstance: (returnUndefined = false) => {
        mockFn({
          registry: {
            IERC20: {
              getInstance: jest.fn(() =>
                returnUndefined ? undefined : 'IERC20 geInstance() mock'
              )
            }
          }
        })
      }
    },
    Reassurance: {
      getInstance: () => {
        mockFn({
          registry: {
            IERC20: {
              getInstance: jest.fn(() =>
                Promise.resolve('geInstance() mock')
              )
            }
          }
        })
      }
    },
    Resolution: {
      getInstance: (returnUndefined = false) => {
        mockFn({
          resgistry: {
            Resolution: {
              getInstance: jest.fn(() =>
                Promise.resolve(
                  returnUndefined ? undefined : 'Resolution geInstance() mock'
                )
              )
            }
          }
        })
      }
    },
    Cover: {
      getInstance: (returnUndefined = false) => {
        mockFn({
          registry: {
            Cover: {
              getInstance: jest.fn(() =>
                Promise.resolve(
                  returnUndefined ? undefined : 'Cover geInstance() mock'
                )
              )
            }
          }
        })
      }
    },
    Vault: {
      getInstance: (returnUndefined = false) => {
        mockFn({
          registry: {
            Vault: {
              getInstance: jest.fn(() =>
                Promise.resolve(
                  returnUndefined ? undefined : 'Vault geInstance() mock'
                )
              )
            }
          }
        })
      },
      getAddress: () => {
        mockFn({
          registry: {
            Vault: {
              getAddress: jest.fn(() =>
                Promise.resolve(testData.vaultAddress)
              )
            }
          }
        })
      }
    },
    PolicyContract: {
      getInstance: (returnUndefined = false) => {
        mockFn({
          registry: {
            PolicyContract: {
              getInstance: jest.fn(() =>
                Promise.resolve(
                  returnUndefined ? undefined : 'PolicyContract getInstance() mock'
                )
              )
            }
          }
        })
      },
      getAddress: (returnUndefined = false, functionUndefined = false) => {
        const mockFunction = jest.fn(() =>
          Promise.resolve(
            returnUndefined ? undefined : 'PolicyContract getAddress() mock'
          )
        )

        mockFn({
          registry: {
            PolicyContract: {
              getAddress: functionUndefined ? undefined : mockFunction
            }
          }
        })
      }
    },
    ClaimsProcessor: {
      getAddress: () => {
        mockFn({
          registry: {
            ClaimsProcessor: {
              getAddress: jest.fn(() =>
                Promise.resolve(testData.claimsProcessorAddress)
              )
            }
          }
        })
      }
    },
    StakingPools: {
      getInstance: (returnUndefined = false) => {
        mockFn({
          registry: {
            StakingPools: {
              getInstance: jest.fn(() =>
                Promise.resolve(
                  returnUndefined ? undefined : 'StakingPools getInstance() mock'
                )
              )
            }
          }
        })
      },
      getAddress: () => {
        mockFn({
          registry: {
            StakingPools: {
              getAddress: jest.fn(() =>
                Promise.resolve(testData.poolInfo.info.stakingPoolsContractAddress)
              )
            }
          }
        })
      }
    },
    Protocol: {
      getAddress: (returnUndefined = false, functionUndefined = false) => {
        const mockFunction = jest.fn(() =>
          Promise.resolve(
            returnUndefined ? undefined : 'Protocol getAddress() mock'
          )
        )

        mockFn({
          registry: {
            Protocol: {
              getAddress: functionUndefined
                ? undefined
                : mockFunction
            }
          }
        })
      }
    }
  },
  utils: {
    ipfs: {
      write: (returnUndefined = false) => {
        mockFn({
          utils: {
            ipfs: {
              write: jest.fn((payload) =>
                Promise.resolve(returnUndefined ? undefined : [payload.toString()])
              )
            }
          }
        })
      },
      readBytes32: (ipfsBytes) => {
        mockFn({
          utils: {
            ipfs: {
              readBytes32: jest.fn(() => Promise.resolve(ipfsBytes))
            }
          }
        })
      }
    }
  },
  governance: {
    report: () => {
      mockFn({
        governance: {
          report: jest.fn(() =>
            Promise.resolve(testData.governanceReportResult)
          )
        }
      })
    }
  },
  multicall: (returnData) => {
    const data = {
      getCoverFeeInfo:
        returnData?.getCoverFeeInfo ?? jest.fn(() => 'getCoverFeeInfo mock'),
      getExpiryDate:
        returnData?.getExpiryDate ?? jest.fn(() => 'getexpirydate mock'),
      hasRole: returnData?.hasRole ?? jest.fn((...args) => args),
      calculateLiquidity:
        returnData?.calculateLiquidity ?? jest.fn((...args) => args),
      init: returnData?.init ?? jest.fn(() => Promise.resolve('init')),
      all:
        returnData?.all ??
        jest.fn(() => {
          const { getCoverFeeInfoResult, getExpiryDateResult } =
            testData.multicallProvider
          return Promise.resolve([
            getCoverFeeInfoResult,
            getExpiryDateResult
          ])
        })
    }

    class MockContract {
      getCoverFeeInfo = data.getCoverFeeInfo;
      getExpiryDate = data.getExpiryDate;
      hasRole = data.hasRole;
      calculateLiquidity = data.calculateLiquidity;
    }
    class MockProvider {
      init = data.init;
      all = data.all;
    }

    mockFn({
      multicall: {
        Contract: MockContract,
        Provider: MockProvider
      }
    })
  }
}

export { mockSdk }
