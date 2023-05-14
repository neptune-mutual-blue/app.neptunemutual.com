import { Alert } from '@/common/Alert/Alert'
import {
  act,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('alert component behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render any children passed to it', () => {
    render(<Alert>This shows alert text.</Alert>)
    const divElement = screen.getByText(/This shows alert text./i)
    expect(divElement).toBeInTheDocument()
  })

  test('should have class if info prop is passed to it', async () => {
    const screen = render(
      <Alert info>This shows text with blue border.</Alert>
    )
    const results = screen.container.getElementsByClassName('border-4E7DD9')
    expect(results.length).toEqual(1)
  })
})
