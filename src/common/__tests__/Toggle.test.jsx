const { Toggle } = require('@/common/Toggle')
const { initiateTest } = require('@/utils/unit-tests/helpers')
const { screen, fireEvent } = require('@testing-library/react')

const props = {
  enabled: false,
  setEnabled: jest.fn()
}
describe('Toggle test', () => {
  const { initialRender, rerenderFn } = initiateTest(Toggle, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the main container', () => {
    const wrapper = screen.getByTestId('toggle-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have class `bg-B0C4DB` class when disabled', () => {
    const switchComp = screen.getByTestId('switch-component')
    expect(switchComp).toHaveClass('bg-B0C4DB')
  })

  test('simulating toggle event', () => {
    const switchComp = screen.getByTestId('switch-component')
    fireEvent.click(switchComp)
    expect(props.setEnabled).toHaveBeenCalled()
  })

  test('should have class `bg-4E7DD9` when enabled', () => {
    rerenderFn({ enabled: true })
    const switchComp = screen.getByTestId('switch-component')
    expect(switchComp).toHaveClass('bg-4E7DD9')
  })
})
