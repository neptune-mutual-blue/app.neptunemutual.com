import { initiateTest } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'
import ReportingNewCoverPage from '@/src/pages/covers/[coverId]/new-report/index'

jest.mock('@/modules/reporting/new', () => {
  return {
    NewIncidentReportPage: () => {
      return <div data-testid='new-incident-report-page' />
    }
  }
})

describe('ReportingNewCoverPage test', () => {
  const { initialRender } = initiateTest(ReportingNewCoverPage)

  beforeEach(() => {
    initialRender()
  })

  test('should display ReportingNewCoverPage with NewIncidentReportPage component', () => {
    const incident = screen.getByTestId('new-incident-report-page')
    expect(incident).toBeInTheDocument()
  })
})
