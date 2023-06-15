import { testData } from '@/utils/unit-tests/test-data'
import * as mockNeptuneMutualSDK from '@neptunemutual/sdk'

const mockSdk = {
  registry: {
    BondPool: {
      getInstance: (returnData = 'geInstance() mock') => {
        mockNeptuneMutualSDK.registry.BondPool.getInstance.mockResolvedValue(returnData)
      },
      getAddress: (returnData = testData.bondPoolAddress) => {
        mockNeptuneMutualSDK.registry.BondPool.getAddress.mockResolvedValue(returnData)
      }
    },
    Governance: {
      getInstance: (returnData = 'getInstance() mock') => {
        mockNeptuneMutualSDK.registry.Governance.getInstance.mockResolvedValue(returnData)
      },
      getAddress: (returnData = testData.governanceAddress) => {
        mockNeptuneMutualSDK.registry.Governance.getAddress.mockResolvedValue(returnData)
      }
    },
    IERC20: {
      getInstance: (returnUndefined = false, returnData = 'IERC20 geInstance() mock') => {
        mockNeptuneMutualSDK.registry.IERC20.getInstance.mockResolvedValue(
          returnUndefined ? undefined : returnData
        )
      }
    },
    Reassurance: {
      getInstance: (returnData = 'geInstance() mock') => {
        mockNeptuneMutualSDK.registry.IERC20.getInstance.mockResolvedValue(returnData)
      }
    },
    Resolution: {
      getInstance: (returnUndefined = false, returnData = 'Resolution geInstance() mock') => {
        mockNeptuneMutualSDK.registry.Resolution.getInstance.mockResolvedValue(
          returnUndefined ? undefined : returnData
        )
      }
    },
    Cover: {
      getInstance: (returnUndefined = false, returnData = 'Cover geInstance() mock') => {
        mockNeptuneMutualSDK.registry.Cover.getInstance.mockResolvedValue(
          returnUndefined ? undefined : returnData
        )
      }
    },
    Vault: {
      getInstance: (returnUndefined = false, returnData = 'Vault geInstance() mock') => {
        mockNeptuneMutualSDK.registry.Vault.getInstance.mockResolvedValue(
          returnUndefined ? undefined : returnData
        )
      },
      getAddress: (returnData = testData.vaultAddress) => {
        mockNeptuneMutualSDK.registry.Vault.getAddress.mockResolvedValue(returnData)
      }
    },
    PolicyContract: {
      getInstance: (returnUndefined = false, returnData = 'PolicyContract getInstance() mock') => {
        mockNeptuneMutualSDK.registry.PolicyContract.getInstance.mockResolvedValue(
          returnUndefined ? undefined : returnData
        )
      },
      getAddress: (returnUndefined = false, functionUndefined = false, returnData = 'PolicyContract getAddress() mock') => {
        const mockFunction = jest.fn(() =>
          Promise.resolve(
            returnUndefined ? undefined : returnData
          )
        )
        mockNeptuneMutualSDK.registry.PolicyContract.getAddress.mockResolvedValue(
          functionUndefined ? undefined : mockFunction
        )
      }
    },
    ClaimsProcessor: {
      getAddress: (returnData = testData.claimsProcessorAddress) => {
        mockNeptuneMutualSDK.registry.ClaimsProcessor.getAddress.mockResolvedValue(returnData)
      }
    },
    StakingPools: {
      getInstance: (returnUndefined = false, returnData = 'StakingPools getInstance() mock') => {
        mockNeptuneMutualSDK.registry.StakingPools.getInstance.mockResolvedValue(
          returnUndefined ? undefined : returnData
        )
      },
      getAddress: (returnData = testData.poolInfo.info.stakingPoolsContractAddress) => {
        mockNeptuneMutualSDK.registry.StakingPools.getAddress.mockResolvedValue(returnData)
      }
    },
    Protocol: {
      getAddress: (returnUndefined = false, functionUndefined = false, returnData = 'Protocol getAddress() mock') => {
        const mockFunction = jest.fn(() =>
          Promise.resolve(
            returnUndefined ? undefined : returnData
          )
        )
        mockNeptuneMutualSDK.registry.Protocol.getAddress.mockResolvedValue(
          functionUndefined
            ? undefined
            : mockFunction
        )
      }
    }
  },
  utils: {
    ipfs: {
      write: (returnUndefined = false) => {
        mockNeptuneMutualSDK.utils.ipfs.write.mockImplementation(
          (payload) => returnUndefined ? undefined : [payload.toString()]
        )
      },
      readBytes32: (ipfsBytes) => {
        mockNeptuneMutualSDK.utils.ipfs.read.mockResolvedValue(ipfsBytes)
      }
    },
    keyUtil: {
      toBytes32: (isCode) => {
        mockNeptuneMutualSDK.utils.keyUtil.toBytes32.mockResolvedValue(isCode ? true : new Error())
      }
    }
  },
  governance: {
    report: (returnData = testData.governanceReportResult) => {
      mockNeptuneMutualSDK.governance.report.mockResolvedValue(returnData)
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

    mockNeptuneMutualSDK.multicall.Contract.mockImplementation(MockContract)
    mockNeptuneMutualSDK.multicall.Provider.mockImplementation(MockProvider)
  }
}

export { mockSdk }
