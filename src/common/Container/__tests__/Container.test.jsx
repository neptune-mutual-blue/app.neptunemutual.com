import { screen, act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { Container } from '@/common/Container/Container'

describe('Container component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render children passed to it', () => {
    render(<Container>This should be rendered text.</Container>)
    const divElement = screen.getByText(/This should be rendered text./i)
    expect(divElement).toBeInTheDocument()
  })

  test('should add classes passed to it as a prop', () => {
    const screen = render(
      <Container className='testing-class'>
        This should be rendered text.
      </Container>
    )
    const element = screen.container.getElementsByClassName('testing-class')
    expect(element.length).toEqual(1)
  })
})
