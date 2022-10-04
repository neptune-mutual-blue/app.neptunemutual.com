import { BurgerMenu } from '@/common/BurgerMenu/BurgerMenu'
import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('BurgerMenu component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const isOpen = true

  test("should have class 'z-20' when opened", () => {
    const { container } = render(
      <BurgerMenu isOpen={isOpen} onToggle={() => {}} />
    )
    const classes = container.getElementsByClassName('z-20')
    expect(classes.length).toEqual(1)
  })
})
