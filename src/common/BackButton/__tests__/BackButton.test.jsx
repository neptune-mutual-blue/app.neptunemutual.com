import { render, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { BackButton } from '../BackButton'
import { i18n } from '@lingui/core'

describe('should render BackButton Component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should receive onClick handler pass to it', () => {
    const mockOnClick = jest.fn()
    const { getByRole } = render(<BackButton onClick={mockOnClick} />)
    const button = getByRole('button', {
      name: /Back/i
    })

    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('should receive classNames pass to it', () => {
    const { getByRole } = render(<BackButton className='back-button-class' />)
    const button = getByRole('button', {
      name: /Back/i
    })

    expect(button).toHaveClass('back-button-class')
  })
})
