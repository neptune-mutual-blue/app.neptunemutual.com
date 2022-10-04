import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { Divider } from '@/common/Divider/Divider'

describe('Divider component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should add classes passed to it as a prop', () => {
    const screen = render(<Divider className='testing-class' />)
    const element = screen.container.getElementsByClassName('testing-class')
    expect(element.length).toEqual(1)
  })
})
