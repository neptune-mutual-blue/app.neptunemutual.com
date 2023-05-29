import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

jest.mock('@/modules/reporting/new', () => ({
  NewIncidentReportPage: () => (
    <div data-testid='new-incident-report-page' />
  )
}))

describe('ReportingNewCoverPage test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_ENABLE_V2: 'true' }
    const ReportingNewCoverPage =
      require('@/pages/covers/[coverId]/products/[productId]/new-report').default
    const { initialRender } = initiateTest(ReportingNewCoverPage)

    initialRender()
  })
  test('Should display incident report page', () => {
    const newIncidentReportPage = screen.getByTestId(
      'new-incident-report-page'
    )
    expect(newIncidentReportPage).toBeInTheDocument()
  })
})
