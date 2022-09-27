import { CoverActionCard } from '@/common/Cover/CoverActionCard'
import { render, act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('CoverActionCard behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render children passed to it and be able to click the button if isOpen set to true', () => {
    const screen = render(
      <CoverActionCard
        description='this is a test description'
        title='Purchase Policy'
      />
    )
    const descriptionText = screen.getByText(/this is a test description/i)
    expect(descriptionText).toBeInTheDocument()
    const headingText = screen.getByRole('heading')
    expect(headingText).toHaveTextContent('Purchase Policy')
  })
})
