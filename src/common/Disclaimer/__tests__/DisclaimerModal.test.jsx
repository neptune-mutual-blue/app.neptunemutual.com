import { screen, fireEvent } from '@/utils/unit-tests/test-utils'
import { TestnetDisclaimerModal } from '@/common/Disclaimer/DisclaimerModal'
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'

describe('Disclaimer Modal test', () => {
  const setDisclaimerApproval = jest.fn()
  const { initialRender } = initiateTest(TestnetDisclaimerModal, {}, () => {
    mockFn.useLocalStorage(() => [false, setDisclaimerApproval])
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('disclaimer-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render title correctly', () => {
    const wrapper = screen.getByTestId('disclaimer-title')
    expect(wrapper).toHaveTextContent('Disclaimer and Warranty')
  })

  test('should render description correctly', () => {
    const wrapper = screen.getByTestId('disclaimer-description')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render checkbox correctly', () => {
    const wrapper = screen.getByTestId('disclaimer-checkbox')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render checkbox label correctly', () => {
    const wrapper = screen.getByTestId('disclaimer-checkbox-label')
    expect(wrapper).toBeInTheDocument()
  })

  test('checkbox should be unchecked by default', () => {
    const wrapper = screen.getByTestId('disclaimer-checkbox')
    expect(wrapper).toHaveProperty('checked', false)
  })

  test('simulating `change` in checkbox', () => {
    const wrapper = screen.getByTestId('disclaimer-checkbox')
    fireEvent.click(wrapper)
    expect(wrapper).toHaveProperty('checked', true)
  })

  test('should render the `Decline` button', () => {
    const button = screen.getByTestId('disclaimer-accept')
    expect(button).toBeInTheDocument()
  })

  test('should render the `Accept` button', () => {
    const button = screen.getByTestId('disclaimer-accept')
    expect(button).toBeInTheDocument()
  })

  test('should disable the `Accept` button by default', () => {
    const button = screen.getByTestId('disclaimer-accept')
    expect(button).toBeDisabled()
  })

  test('should enable the `Accept` button when checkbox is checked', () => {
    const checkbox = screen.getByTestId('disclaimer-checkbox')
    fireEvent.click(checkbox)

    const button = screen.getByTestId('disclaimer-accept')
    expect(button).not.toBeDisabled()
  })

  test('simulating clicking on `Accept` button', () => {
    const checkbox = screen.getByTestId('disclaimer-checkbox')
    fireEvent.click(checkbox)

    const button = screen.getByTestId('disclaimer-accept')
    fireEvent.click(button)
    expect(setDisclaimerApproval).toHaveBeenCalledWith(true)
  })

  test('simulating clicking on `Decline` button', () => {
    const button = screen.getByTestId('disclaimer-decline')
    fireEvent.click(button)
  })
})
