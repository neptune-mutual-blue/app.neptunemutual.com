import { useNetwork } from '@/src/context/Network'
import { getPolicyInfo } from '@/src/services/protocol/policy/info'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

export const usePolicyDisabledStatus = ({
  coverKey,
  productKey
}) => {
  const { library } = useWeb3React()
  const { networkId } = useNetwork()

  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (!networkId || !library) { return }

    async function getInfo () {
      const info = await getPolicyInfo(networkId, coverKey, productKey, library)
      setDisabled(info.policyDisabledStatus)
    }
    getInfo()
  }, [coverKey, productKey, networkId, library])

  return disabled
}
