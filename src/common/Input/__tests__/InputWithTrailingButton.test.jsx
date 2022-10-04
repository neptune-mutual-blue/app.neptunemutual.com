import { act, render, fireEvent } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { InputWithTrailingButton } from '@/common/Input/InputWithTrailingButton'

describe('InputWithTrailingButton component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const btnHandler = jest.fn()
  const onChange = jest.fn()

  test('should fire btnHandler on clicking button and btn should have text Max', () => {
    const screen = render(
      <InputWithTrailingButton
        buttonProps={{
          children: 'Max',
          onClick: btnHandler
        }}
        unit='NPM-USDC LP'
        inputProps={{
          id: 'test-input-id',
          placeholder: 'Enter Amount'
        }}
        decimalLimit={0}
        error={{}}
      />
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(button).toHaveTextContent('Max')
    expect(btnHandler).toHaveBeenCalledTimes(1)
  })

  test('should have unit rendered on the document', () => {
    const screen = render(
      <InputWithTrailingButton
        buttonProps={{
          children: 'Max',
          onClick: btnHandler
        }}
        unit='NPM-USDC LP'
        inputProps={{
          id: 'test-input-id',
          placeholder: 'Enter Amount'
        }}
        decimalLimit=''
        error=''
      />
    )
    const unitText = screen.getByText(/NPM-USDC LP/i)
    expect(unitText).toBeInTheDocument()
  })

  test('should have input disabled if inputprops has disabled property', () => {
    const screen = render(
      <InputWithTrailingButton
        buttonProps={{
          children: 'Max',
          onClick: btnHandler
        }}
        unit='NPM-USDC LP'
        inputProps={{
          id: 'test-input-id',
          placeholder: 'Enter Amount',
          onChange: onChange,
          disabled: false
        }}
        decimalLimit=''
        error=''
      />
    )
    const input = screen.container.getElementsByTagName('input')
    const element = input[0].getAttribute('disabled')
    fireEvent.change(input[0], { target: { value: '23' } })
    expect(element).toBeFalsy()
    expect(input[0]).toHaveValue('23')
  })
})
