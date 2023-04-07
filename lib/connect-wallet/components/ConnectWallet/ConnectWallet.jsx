import { useState } from 'react'

import { useWeb3React } from '@web3-react/core'

import useAuth from '../../hooks/useAuth'
import { Popup } from './Popup'
import { WalletDisclaimerPoup } from '@/lib/connect-wallet/components/ConnectWallet/WalletDisclaimerPopup'

export default function ConnectWallet ({ networkId, notifier, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const { active } = useWeb3React()

  const { logout } = useAuth(networkId, notifier)

  function onClose () {
    setIsOpen(false)
  }

  function onOpen () {
    if (active) {
      logout()
    }

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

      <WalletDisclaimerPoup />
    </>
  )
}
