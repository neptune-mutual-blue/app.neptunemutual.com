import { ModalRegular } from '@/common/Modal/ModalRegular'
import {
  act,
  fireEvent,
  render
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ModalRegular behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const onClose = jest.fn()

  const ModalRegularComponent = (isOpen, disabled) => {
    return (
      <ModalRegular isOpen={isOpen} onClose={onClose} disabled={disabled}>
        <button
          onClick={onClose}
          className='absolute flex items-center justify-center text-black rounded-md top-5 right-6 sm:top-7 sm:right-12 hover:text-4E7DD9 focus:text-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-transparent'
        >
          <span className='sr-only'>Close</span>
        </button>
      </ModalRegular>
    )
  }

  test('should render children passed to it and be able to click the button if isOpen set to true', () => {
    const screen = render(ModalRegularComponent(true, false))
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(onClose).toBeCalledTimes(1)
  })
})
