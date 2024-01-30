import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { config, registry, utils, multicall } from '@neptunemutual/sdk'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useLingui } from '@lingui/react'

export const useRoles = () => {
  const [roles, setRoles] = useState({
    isGovernanceAgent: false,
    isGovernanceAdmin: false,
    isLiquidityManager: false,
    isCoverManager: false
  })
  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  useEffect(() => {
    let ignore = false
    if (!networkId || !account) {
      return
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    async function exec () {
      const handleError = (err) => {
        notifyError(err, t(i18n)`Could not get roles`)
      }

      try {
        const protocolAddress = await registry.Protocol.getAddress(
          networkId,
          signerOrProvider
        )

        const { Contract, Provider } = multicall

        const multiCallProvider = new Provider(signerOrProvider.provider)

        await multiCallProvider.init() // Only required when `chainId` is not provided in the `Provider` constructor

        const instance = new Contract(protocolAddress, config.abis.IProtocol)

        const isGovernanceAgentCall = instance.hasRole(
          utils.keyUtil.ACCESS_CONTROL.GOVERNANCE_AGENT,
          account
        )
        const isGovernanceAdminCall = instance.hasRole(
          utils.keyUtil.ACCESS_CONTROL.GOVERNANCE_ADMIN,
          account
        )
        const isLiquidityManagerCall = instance.hasRole(
          utils.keyUtil.ACCESS_CONTROL.LIQUIDITY_MANAGER,
          account
        )
        const isCoverManagerCall = instance.hasRole(
          utils.keyUtil.ACCESS_CONTROL.COVER_MANAGER,
          account
        )

        const [
          isGovernanceAgent,
          isGovernanceAdmin,
          isLiquidityManager,
          isCoverManager
        ] = await multiCallProvider.all([
          isGovernanceAgentCall,
          isGovernanceAdminCall,
          isLiquidityManagerCall,
          isCoverManagerCall
        ])

        if (ignore) { return }

        setRoles({
          isGovernanceAgent,
          isGovernanceAdmin,
          isLiquidityManager,
          isCoverManager
        })
      } catch (err) {
        handleError(err)
      }
    }

    exec()

    return () => {
      ignore = true
    }
  }, [account, library, networkId, notifyError, i18n])

  return roles
}
