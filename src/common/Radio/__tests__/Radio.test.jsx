import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { Radio } from '@/common/Radio/Radio'

describe('Radio component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render input and have id same as prop passed to it', () => {
    const screen = render(<Radio label='radio' id='test-radio' />)
    const element = screen.container.getElementsByTagName('input')
    expect(element.length).toEqual(1)
    const radio = screen.getByRole('radio')
    expect(radio).toBeInTheDocument()
    expect(radio).toHaveAttribute('id', 'test-radio')
  })

  test('should not be clickable if disabled', () => {
    const screen = render(<Radio label='radio' id='test-radio' disabled />)
    const radio = screen.getByRole('radio')
    expect(radio).toHaveAttribute('disabled')
  })
})
