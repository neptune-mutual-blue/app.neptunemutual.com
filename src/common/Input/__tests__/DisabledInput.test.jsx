import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { DisabledInput } from '@/common/Input/DisabledInput'

describe('DisabledInput component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const mockProps = {
    value: '15000',
    unit: 'USD'
  }

  test('should render value and input with cursor-not-allowed class', () => {
    const screen = render(
      <DisabledInput value={mockProps.value} unit={mockProps.unit} />
    )
    const element = screen.getByText(mockProps.value)
    const unit = screen.getByText(mockProps.unit)
    const cursor = screen.container.getElementsByClassName('cursor-not-allowed')
    expect(element).toBeInTheDocument()
    expect(unit).toBeInTheDocument()
    expect(cursor.length).toEqual(2)
  })
})
