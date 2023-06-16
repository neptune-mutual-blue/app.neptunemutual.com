import React from 'react'

import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { Popup } from '../Popup'

jest.mock('../../../config/wallets', () => ({
  wallets: [
    {
      id: '3',
      name: 'Custom Wallet',
      connectorName: 'injected',
      Icon: () => <></>,
      isAvailable: () => true
    }
  ]
}))

describe('Popup Component', () => {
  const onLogin = jest.fn(() => {})
  const onLogout = jest.fn(() => {})
  const onClose = jest.fn(() => {})
  const notifier = jest.fn(() => {})
  const { initialRender } = initiateTest(Popup, {
    isOpen: true,
    onClose: onClose,
    networkId: testData.network.networkId,
    notifier: notifier
  })

  beforeEach(() => {
    mockHooksOrMethods.useAuth(() => ({
      login: onLogin,
      logout: onLogout
    }))
    i18n.activate('en')

    initialRender()
  })

  test('Show Popup Modal with Custom connect to wallet', () => {
    const closeButton = screen.getByText(/Close/i)

    expect(screen.getByText(/Connect wallet/i)).toBeInTheDocument()
    expect(closeButton).toBeInTheDocument()
    expect(
      screen.getByText(/By connecting a wallet, you agree to Neptune Mutual/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument()
    expect(screen.getByText(/Protocol Disclaimer/i)).toBeInTheDocument()

    const customWallet = screen.getByText(/Custom Wallet/i)
    fireEvent.click(customWallet.parentElement)

    expect(onLogin).toBeCalled()
  })
})
