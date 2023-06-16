import { act, render, fireEvent } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { RegularInput } from '@/common/Input/RegularInput'

describe('Regukar component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const mockProps = {
    approving: false,
    incidentTitle: 'Cover Hack'
  }
  const changeHandler = jest.fn()

  const setup = () => {
    const screen = render(
      <RegularInput
        className='leading-none'
        id='incident_title'
        placeholder='Enter Incident Title'
        value={mockProps.incidentTitle}
        disabled={mockProps.approving}
        onChange={changeHandler}
      />
    )
    const input = screen.getByRole('textbox')

    return {
      input,
      ...screen
    }
  }

  test('should render input with value as passed', () => {
    const { input } = setup()
    expect(input).toBeInTheDocument()
    fireEvent.change(input, { target: { value: 'Protocol Hack' } })
    expect(changeHandler).toHaveBeenCalledTimes(1)
  })
})
