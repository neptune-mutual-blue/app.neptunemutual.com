const { TokenBalance } = require('@/common/TokenBalance')
const { getTokenLink } = require('@/lib/connect-wallet/utils/explorer')
const { convertFromUnits } = require('@/utils/bn')
const { formatCurrency } = require('@/utils/formatter/currency')
const { testData } = require('@/utils/unit-tests/test-data')
const { initiateTest, mockFn } = require('@/utils/unit-tests/test-mockup-fn')
const { screen, fireEvent } = require('@testing-library/react')

describe('TokenBalance', () => {
  const { initialRender } = initiateTest(
    TokenBalance,
    testData.tokenBalanceProps,
    () => {
      mockFn.useNetwork()
      mockFn.useRegisterToken()
      mockFn.useWeb3React()
      mockFn.useToast()
    }
  )
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn()
    }
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render the main container', () => {
    screen.debug()
    const wrapper = screen.getByTestId('token-balance-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct balance', () => {
    const balanceWrapper = screen.getByTestId('balance')

    const expectedData = `Balance: ${
      formatCurrency(
        convertFromUnits(
          testData.tokenBalanceProps.balance,
          testData.tokenBalanceProps.tokenDecimals
        ),
        'en',
        testData.tokenBalanceProps.unit,
        true
      ).short
    }`
    expect(balanceWrapper).toHaveTextContent(expectedData)
  })

  test('should have correct title attribute', () => {
    const balanceWrapper = screen.getByTestId('balance')

    const expectedData = formatCurrency(
      convertFromUnits(
        testData.tokenBalanceProps.balance,
        testData.tokenBalanceProps.tokenDecimals
      ),
      'en',
      testData.tokenBalanceProps.unit,
      true
    ).short
    expect(balanceWrapper).toHaveAttribute('title', expectedData)
  })

  test('should render the copy button', () => {
    const copy = screen.getByTestId('copy-button')
    expect(copy).toBeInTheDocument()
  })

  test('simulating button click', () => {
    const copy = screen.getByTestId('copy-button')
    fireEvent.click(copy)
  })

  test('simulating copy function error', () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: () => {
          throw new Error('Error')
        }
      }
    })

    const copy = screen.getByTestId('copy-button')
    fireEvent.click(copy)
  })

  test('should render the `Open In Explorer` link', () => {
    const copy = screen.getByTestId('explorer-link')
    expect(copy).toBeInTheDocument()
  })

  test('should have correct link in `Open In Explorer` link', () => {
    const explorerLink = screen.getByTestId('explorer-link')

    expect(explorerLink).toHaveAttribute(
      'href',
      getTokenLink(
        testData.network.networkId,
        testData.tokenBalanceProps.tokenAddress,
        testData.account.account
      )
    )
  })

  test('should render the `Add to Metamask` button', () => {
    const add = screen.getByTestId('add-button')
    expect(add).toBeInTheDocument()
  })

  test('should call the register function when the button is clicked', () => {
    const add = screen.getByTestId('add-button')
    fireEvent.click(add)
    expect(testData.registerToken.register).toHaveBeenCalled()
  })
})
