const { Banner } = require('@/common/Banner')
const { FAUCET_URL } = require('@/src/config/constants')
const { mockHooksOrMethods } = require('@/utils/unit-tests/mock-hooks-and-methods')
const { initiateTest } = require('@/utils/unit-tests/helpers')
const { screen, fireEvent } = require('@testing-library/react')

describe('Banner test', () => {
  const { initialRender, rerenderFn } = initiateTest(Banner, {}, () => {
    mockHooksOrMethods.useNetwork()
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render the banner container if networkId is valid', () => {
    const wrapper = screen.queryByTestId('banner-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should not render the banner container if no network', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useNetwork(() => { return { networkId: null } })
    })

    const wrapper = screen.queryByTestId('banner-container')
    expect(wrapper).toBeNull()
  })

  test('should have `Test Tokens` label in the Banner for test network', () => {
    const label1 = screen.queryByText('Test Tokens')
    expect(label1).toBeInTheDocument()
  })

  test('should have correct hrefs for `Test Tokens` & `View Leaderboard`', () => {
    const link1 = screen.getByTestId('faucet-link')
    expect(link1).toHaveAttribute('href', FAUCET_URL)
  })

  test('should render the banner close button', () => {
    const button = screen.getByTestId('close-banner')
    expect(button).toBeInTheDocument()
  })

  test('should not show the banner after the close button is clicked', () => {
    const button = screen.getByTestId('close-banner')
    fireEvent.click(button)
    const wrapper = screen.queryByTestId('banner-container')
    expect(wrapper).toBeNull()
  })
})
