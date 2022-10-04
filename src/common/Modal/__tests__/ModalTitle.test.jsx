import { ModalTitle } from '@/common/Modal/ModalTitle'
import { render, act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ModalTitle behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const imgSrc = '/images/covers/crpool.svg'

  test('should render image passed to it', () => {
    const screen = render(<ModalTitle imgSrc={imgSrc} />)
    const img = screen.getByRole('img')
    expect(img).toBeVisible()
    expect(img).toHaveAttribute('src', imgSrc)
  })

  test('should render any children passed to it', () => {
    const screen = render(<ModalTitle imgSrc={imgSrc}>Modal Title</ModalTitle>)
    const textElement = screen.getByText(/Modal Title/i)
    expect(textElement).toBeInTheDocument()
  })
})
