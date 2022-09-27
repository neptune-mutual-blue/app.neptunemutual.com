import { ScrollToTopButton } from '@/common/ScrollToTop/ScrollToTopButton'
import { render, act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ScrollToTopButton behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  describe('should render ScrollToTopButton properly', () => {
    test('button should be visible', async () => {
      const screen = render(<ScrollToTopButton />)
      const button = screen.getByRole('button')
      expect(button).toBeVisible()
    })
  })
})
