import {
  render,
  act
} from '@/utils/unit-tests/test-utils'
import { TokenAmountInput } from '../TokenAmountInput'
import { i18n } from '@lingui/core'

const mockProps = {
  labelText: 'Enter Npm Amount',
  disabled: true,
  inputValue: '250',
  tokenSymbol: 'NPM',
  tokenBalance: 250000000000000000000
}

describe('TokenAmountInput component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render TokenAmountInput children component', () => {
    const { getByText } = render(
      <TokenAmountInput>
        <div>Child Component</div>
      </TokenAmountInput>
    )

    const childComponent = getByText('Child Component')
    expect(childComponent).toBeInTheDocument()
  })

  test('should render labelText', () => {
    const { getByText } = render(
      <TokenAmountInput {...mockProps}>
        <div>Child Component</div>
      </TokenAmountInput>
    )

    const labelText = getByText('Enter Npm Amount')
    expect(labelText).toBeInTheDocument()
  })

  test('input should be disabled', () => {
    const { getByPlaceholderText } = render(
      <TokenAmountInput {...mockProps}>
        <div>Child Component</div>
      </TokenAmountInput>
    )

    const placeholderText = getByPlaceholderText('Enter Amount')
    expect(placeholderText).toBeDisabled()
  })

  test('input value should be displayed', () => {
    const { getByDisplayValue } = render(
      <TokenAmountInput {...mockProps}>
        <div>Child Component</div>
      </TokenAmountInput>
    )

    const inputValue = getByDisplayValue('250')
    expect(inputValue).toHaveValue('250')
  })

  test('should render tokenSymbol', () => {
    const { getByText } = render(
      <TokenAmountInput {...mockProps}>
        <div>Child Component</div>
      </TokenAmountInput>
    )

    const tokenSymbol = getByText('NPM')
    expect(tokenSymbol).toBeInTheDocument()
  })

  test('should render tokenBalance', () => {
    const { getByTitle } = render(
      <TokenAmountInput {...mockProps}>
        <div>Child Component</div>
      </TokenAmountInput>
    )

    const tokenBalance = getByTitle('250 NPM')
    expect(tokenBalance).toBeInTheDocument()
  })
})
