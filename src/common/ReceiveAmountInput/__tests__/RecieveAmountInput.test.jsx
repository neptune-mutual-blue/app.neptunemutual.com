import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { ReceiveAmountInput } from '@/common/ReceiveAmountInput/ReceiveAmountInput'

describe('ReceiveAmountInput component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render values passed to it', () => {
    const screen = render(
      <ReceiveAmountInput
        labelText='You Will Receive'
        tokenSymbol='POD'
        inputValue='250'
      />
    )
    const inputVal = screen.getByText('250')
    const label = screen.getByText(/You Will Receive/i)
    const symbol = screen.getByText(/250/i)
    expect(inputVal).toBeInTheDocument()
    expect(label).toBeInTheDocument()
    expect(symbol).toBeInTheDocument()
  })
})
