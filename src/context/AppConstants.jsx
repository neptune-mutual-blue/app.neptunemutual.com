import React, {
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { ChainConfig } from '@/src/config/hardcoded'
import { useNetwork } from '@/src/context/Network'
import { usePoolsTVL } from '@/src/hooks/usePoolsTVL'
import { useRoles } from '@/src/hooks/useRoles'
import {
  getAddressesFromApi,
  getAddressesFromProvider
} from '@/src/services/contracts/getAddresses'
import { useWeb3React } from '@web3-react/core'

const initValue = {
  NPMTokenAddress: '',
  NPMTokenDecimals: ChainConfig[1].npm.tokenDecimals,
  NPMTokenSymbol: ChainConfig[1].npm.tokenSymbol,
  liquidityTokenAddress: '',
  liquidityTokenSymbol: ChainConfig[1].stablecoin.tokenSymbol,
  liquidityTokenDecimals: ChainConfig[1].stablecoin.tokenDecimals,
  poolsTvl: '0',
  getTVLById: (_id) => { return '0' },
  getPriceByAddress: (_address) => { return '0' },
  roles: {
    isGovernanceAgent: false,
    isGovernanceAdmin: false,
    isLiquidityManager: false,
    isCoverManager: false
  }
}

const AppConstantsContext = React.createContext(initValue)

export function useAppConstants () {
  const context = React.useContext(AppConstantsContext)
  if (context === undefined) {
    throw new Error(
      'useAppConstants must be used within a AppConstantsProvider'
    )
  }

  return context
}

export const AppConstantsProvider = ({ children }) => {
  const { networkId } = useNetwork()
  const [data, setData] = useState(initValue)
  const { tvl, getTVLById, getPriceByAddress } = usePoolsTVL(data.NPMTokenAddress)
  const { library, account } = useWeb3React()

  const roles = useRoles()

  useEffect(() => {
    let ignore = false
    if (!networkId) { return }

    if (!account) {
      getAddressesFromApi(networkId)
        .then((result) => {
          if (!result || ignore) {
            return
          }

          const {
            NPMTokenAddress,
            liquidityTokenAddress,
            NPMTokenDecimals,
            NPMTokenSymbol,
            liquidityTokenDecimals,
            liquidityTokenSymbol
          } = result

          setData((prev) => {
            return {
              ...prev,
              NPMTokenAddress,
              NPMTokenDecimals,
              NPMTokenSymbol,
              liquidityTokenAddress,
              liquidityTokenDecimals,
              liquidityTokenSymbol
            }
          })
        })
        .catch(console.error)

      return () => {
        ignore = true
      }
    }
    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    getAddressesFromProvider(networkId, signerOrProvider)
      .then((result) => {
        if (!result || ignore) {
          return
        }

        const {
          NPMTokenAddress,
          liquidityTokenAddress,
          NPMTokenDecimals,
          NPMTokenSymbol,
          liquidityTokenDecimals,
          liquidityTokenSymbol
        } = result

        setData((prev) => {
          return {
            ...prev,
            NPMTokenAddress,
            NPMTokenDecimals,
            NPMTokenSymbol,
            liquidityTokenAddress,
            liquidityTokenDecimals,
            liquidityTokenSymbol
          }
        })
      })
      .catch(console.error)

    return () => {
      ignore = true
    }
  }, [account, library, networkId])

  return (
    <AppConstantsContext.Provider
      value={{
        ...data,
        poolsTvl: tvl,
        getTVLById,
        getPriceByAddress,
        roles
      }}
    >
      {children}
    </AppConstantsContext.Provider>
  )
}
