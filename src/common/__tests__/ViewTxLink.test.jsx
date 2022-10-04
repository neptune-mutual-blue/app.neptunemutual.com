import { ViewTxLink } from '@/common/ViewTxLink'
import { initiateTest } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

describe('ViewTxLink', () => {
  const props = {
    txLink:
      'https://etherscan.io/tx/0x1234567890123456789012345678901234567890'
  }
  const { initialRender } = initiateTest(ViewTxLink, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the main wrapper', () => {
    const wrapper = screen.getByTestId('view-tx-link')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have correct link', () => {
    const link = screen.getByTestId('view-tx-link')
    expect(link).toHaveAttribute('href', props.txLink)
  })

  test('should render the `View transaction` label', () => {
    const label = screen.getByText('View transaction')
    expect(label).toBeInTheDocument()
  })
})
