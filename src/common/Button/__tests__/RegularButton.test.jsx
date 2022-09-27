import { render, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { RegularButton } from '../RegularButton'
import { i18n } from '@lingui/core'

describe('should render NeutralButton Component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should receive onClick handler pass to it', () => {
    const mockOnClick = jest.fn()
    const { getByRole } = render(<RegularButton onClick={mockOnClick} />)
    const button = getByRole('button')

    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('should receive classNames pass to it', () => {
    const { getByRole } = render(
      <RegularButton className='regular-button-class' />
    )
    const button = getByRole('button')

    expect(button).toHaveClass('regular-button-class')
  })

  test('should render any children passed to it', () => {
    const { getByText } = render(<RegularButton>Regular Button</RegularButton>)
    const component = getByText('Regular Button')

    expect(component).toBeInTheDocument()
  })
})
