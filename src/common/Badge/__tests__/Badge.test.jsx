import { Badge } from '@/common/Badge/Badge'
import { screen, act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('Badge component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render any children passed to it', () => {
    render(<Badge>20%</Badge>)
    const divElement = screen.getByText(/20%/i)
    expect(divElement).toBeInTheDocument()
  })
})
