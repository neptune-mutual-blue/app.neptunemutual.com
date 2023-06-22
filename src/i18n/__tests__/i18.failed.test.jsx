import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { Trans } from '@lingui/macro'
import {
  screen,
  waitFor
} from '@testing-library/react'

import { LanguageProvider } from '../i18n'

jest.mock('../dynamic-activate', () => {
  return {
    dynamicActivate: jest.fn(() => { return Promise.resolve('Error in dynamic-activate') })
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

      window.addEventListener('languagechange', languagechange)

      window.dispatchEvent(new Event('languagechange'))

      expect(languagechange).toBeCalled()
    })
  })
})
