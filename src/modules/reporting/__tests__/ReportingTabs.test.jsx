import { ReportingTabs } from '@/modules/reporting/ReportingTabs'
import { render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ReportingTabs test', () => {
  beforeEach(() => {
    i18n.activate('en')
  })

  test('should render the recent votes table', () => {
    const screen = render(<ReportingTabs active='resolved' />)
    const resolvedTab = screen.container.getElementsByClassName('text-4E7DD9')
    const reporting = screen.getByText('Reporting')
    expect(resolvedTab[0]).toHaveTextContent('Resolved')
    expect(reporting).toBeInTheDocument()
  })
})
