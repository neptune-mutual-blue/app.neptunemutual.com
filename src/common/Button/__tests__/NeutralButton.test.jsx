import { render, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { NeutralButton } from '../NeutralButton'
import { i18n } from '@lingui/core'

describe('should render NeutralButton Component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should receive onClick handler pass to it', () => {
    const mockOnClick = jest.fn()
    const { getByRole } = render(<NeutralButton onClick={mockOnClick} />)
    const button = getByRole('button')

    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('should receive classNames pass to it', () => {
    const { getByRole } = render(
      <NeutralButton className='neutral-button-class' />
    )
    const button = getByRole('button')

    expect(button).toHaveClass('neutral-button-class')
  })

  test('should render any children passed to it', () => {
    const { getByText } = render(<NeutralButton>Neutral Button</NeutralButton>)
    const component = getByText('Neutral Button')

    expect(component).toBeInTheDocument()
  })
})
