import { WithdrawLiquidityModal } from '@/modules/my-liquidity/content/WithdrawLiquidityModal'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { fireEvent, screen } from '@testing-library/react'

describe('WithdrawLiquidityModal', () => {
  const props = {
    modalTitle: 'Test Modal Title',
    isOpen: true,
    onClose: jest.fn()
  }
  const { initialRender } = initiateTest(WithdrawLiquidityModal, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the main container', () => {
    const downloadButton = screen.getByTestId('withdraw-liquidity-modal')
    expect(downloadButton).toBeInTheDocument()
  })

  test('should render the modal title', () => {
    const title = screen.getByText(props.modalTitle)
    expect(title).toBeInTheDocument()
  })

  test('should render ModalCloseButton component', () => {
    const button = screen.getByTestId('modal-close-button')
    expect(button).toBeInTheDocument()
  })

  test('should call onClose function when the close button is clicked', () => {
    const button = screen.getByTestId('modal-close-button')
    fireEvent.click(button)
    expect(props.onClose).toHaveBeenCalled()
  })

  test('should render the WithdrawLiquidityForm component', () => {
    const formInputs = screen.getByTestId('withdraw-liquidity-form-inputs')
    const formButtons = screen.getByTestId('withdraw-liquidity-form-buttons')
    expect(formInputs).toBeInTheDocument()
    expect(formButtons).toBeInTheDocument()
  })
})
