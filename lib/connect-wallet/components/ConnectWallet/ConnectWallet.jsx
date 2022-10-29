import { useState } from 'react'

import { useWeb3React } from '@web3-react/core'
import useAuth from '../../hooks/useAuth'
import { Popup } from './Popup'
import { logOpenConnectionPopup } from '@/src/services/logs'
import { analyticsLogger } from '@/utils/logger'

export default function ConnectWallet ({ networkId, notifier, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const { active, chainId, account } = useWeb3React()

  const { logout } = useAuth(networkId, notifier)

  function onClose () {
    setIsOpen(false)
  }

  function onOpen () {
    if (active) {
      logout()
    }
    analyticsLogger(() => logOpenConnectionPopup(chainId ?? null, account ?? null))

    setIsOpen(true)
  }

  return (
    <>
      {children({ onOpen, logout })}
      <Popup
        isOpen={isOpen}
        onClose={onClose}
        networkId={networkId}
        notifier={notifier}
      />
    </>
  )
}
