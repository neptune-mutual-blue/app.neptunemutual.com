import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { render, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ModalCloseButton behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const onClickHandler = jest.fn()

  describe('should render ScrollToTopButton properly', () => {
    test('button should be visible and when disabled dont fire handler', async () => {
      const screen = render(<ModalCloseButton disabled />)
      const button = screen.getByRole('button')
      expect(button).toBeVisible()
      fireEvent.click(button)
      expect(onClickHandler).not.toBeCalled()
    })

    test('button handler to be called when not disabled', () => {
      const screen = render(<ModalCloseButton onClick={onClickHandler} />)
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(onClickHandler).toBeCalledTimes(1)
    })
  })
})
