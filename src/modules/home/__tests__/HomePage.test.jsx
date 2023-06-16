import HomePage from '@/modules/home/index'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { i18n } from '@lingui/core'
import { screen } from '@testing-library/react'

describe('Home Page', () => {
  beforeEach(() => {
    i18n.activate('en')

    const { initialRender } = initiateTest(HomePage, {})

    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useCoversAndProducts2()

    initialRender()
  })

  test('should render the available covers container', () => {
    const availableCoversContainer = screen.getByTestId('available-covers-container')
    expect(availableCoversContainer).toBeInTheDocument()
  })

  test('should render the insights container', () => {
    const NFTBannerContainer = screen.getByTestId(
      'nft-banner'
    )
    expect(NFTBannerContainer).toBeInTheDocument()
  })

  test('should render the insights container', () => {
    const insightsContainer = screen.getByTestId(
      'hero-container'
    )
    expect(insightsContainer).toBeInTheDocument()
  })
})
