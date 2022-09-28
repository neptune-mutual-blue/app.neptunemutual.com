import { TokenAmountWithPrefix } from '@/common/TokenAmountWithPrefix'
import { testData } from '@/utils/unit-tests/test-data'
import { initiateTest } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

describe('TokenAmountSpan', () => {
  const { initialRender } = initiateTest(
    TokenAmountWithPrefix,
    testData.tokenAmountWithPrefixProps
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render main container', () => {
    const wrapper = screen.getByTestId('token-amount-with-prefix')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have proper prefix', () => {
    const textContent = screen.getByTestId(
      'token-amount-with-prefix'
    ).textContent
    expect(textContent).toContain(testData.tokenAmountWithPrefixProps.prefix)
  })

  test('should render the TokenAmountSpan component', () => {
    const component = screen.getByTestId('token-amount-span')
    expect(component).toBeInTheDocument()
  })
})
