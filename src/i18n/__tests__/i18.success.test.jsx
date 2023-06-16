import { screen, waitFor } from '@testing-library/react'
import { LanguageProvider } from '../i18n'
import { Trans } from '@lingui/macro'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

jest.mock('../dynamic-activate', () => {
  return {
    dynamicActivate: jest.fn(() => { return Promise.resolve() })
  }
})

function WithProvider () {
  return (
    <LanguageProvider>
      <Trans>Connect wallet</Trans>
    </LanguageProvider>
  )
}

describe('LanguageProvider', () => {
  const { initialRender } = initiateTest(WithProvider, {})

  const languagechange = jest.fn(() => {})

  test('Should render LanguageProvider', async () => {
    mockHooksOrMethods.useRouter()

    initialRender()

    await waitFor(() => {
      const connectWallet = screen.getByText('Connect wallet')

      expect(connectWallet).toBeInTheDocument()
    })
  })

  test('Should render LanguageProvider', async () => {
    mockHooksOrMethods.useRouter()

    initialRender()

    await waitFor(() => {
      const connectWallet = screen.getByText('Connect wallet')

      expect(connectWallet).toBeInTheDocument()

      window.addEventListener('languagechange', languagechange)

      window.dispatchEvent(new Event('languagechange'))

      expect(languagechange).toBeCalled()
    })
  })
})
