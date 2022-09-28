import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { render, act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ModalWrapper behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render any children passed to it', () => {
    const screen = render(<ModalWrapper>Modal Title</ModalWrapper>)
    const textElement = screen.getByText(/Modal Title/i)
    expect(textElement).toBeInTheDocument()
  })
})
