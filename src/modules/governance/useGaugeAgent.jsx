import {
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { abis } from '@/src/config/contracts/abis'
import { ChainConfig } from '@/src/config/hardcoded'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { contractRead } from '@/src/services/readContract'

import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useGaugeAgent = () => {
  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()

  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  const [isGaugeAgent, setIsGaugeAgent] = useState(false)

  const gcrContractAddress = ChainConfig[networkId].gaugeControllerRegistry

  useEffect(() => {
    (async () => {
      if (!account) {
        setIsGaugeAgent(false)
      }

      try {
        const signerOrProvider = getProviderOrSigner(library, account, networkId)
        const instance = utils.contract.getContract(
          gcrContractAddress,
          abis.GaugeControllerRegistry,
          signerOrProvider
        )
        const hasRole = await contractRead({
          instance,
          methodName: 'hasRole',
          args: [safeFormatBytes32String('role:gauge:agent'), account]
        })

        setIsGaugeAgent(hasRole)
      } catch (err) {
        notifyError(err, t(i18n)`[GCR] Could not check user role`)

        setIsGaugeAgent(false)
      }
    })()
  }, [account, gcrContractAddress, i18n, library, networkId, notifyError])

  return {
    isGaugeAgent
  }
}
