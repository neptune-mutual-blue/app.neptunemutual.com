import { render, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { OutlinedButton } from '../OutlinedButton'
import { i18n } from '@lingui/core'

describe('should render NeutralButton Component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should receive onClick handler pass to it', () => {
    const mockOnClick = jest.fn()
    const { getByRole } = render(<OutlinedButton onClick={mockOnClick} />)
    const button = getByRole('button')

    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('should receive classNames pass to it', () => {
    const { getByRole } = render(
      <OutlinedButton className='outlined-button-class' />
    )
    const button = getByRole('button')

    expect(button).toHaveClass('outlined-button-class')
  })

  test('should render any children passed to it', () => {
    const { getByText } = render(
      <OutlinedButton>Outlined Button</OutlinedButton>
    )
    const component = getByText('Outlined Button')

    expect(component).toBeInTheDocument()
  })
})
