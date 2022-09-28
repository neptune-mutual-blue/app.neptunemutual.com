import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { CoverRules } from '@/common/CoverRules/CoverRules'

describe('CoverRules', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const rules =
    '1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n3. This does not have to be your own loss.'

  test('should render Cover Rules when components got rendered even if rules are not passed to it', () => {
    const screen = render(<CoverRules />)
    const heading = screen.getAllByRole('heading')
    expect(heading[0]).toHaveTextContent('Cover Rules')
  })

  test('should render rules as list items', () => {
    const screen = render(<CoverRules rules={rules} />)
    const olElement = screen.container.getElementsByTagName('ol')
    const listElement = screen.container.getElementsByTagName('li')
    expect(olElement.length).toEqual(1)
    expect(listElement.length).toEqual(rules.split('\n').length)
  })
})
