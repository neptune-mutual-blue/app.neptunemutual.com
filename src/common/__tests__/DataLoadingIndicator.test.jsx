import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'

describe('DataLoadingIndicator component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render message passed to it', () => {
    const screen = render(<DataLoadingIndicator message='approving' />)
    const message = screen.getByText(/approving/i)
    expect(message).toBeInTheDocument()
  })
})
