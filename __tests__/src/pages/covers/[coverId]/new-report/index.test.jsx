import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

jest.mock('@/modules/reporting/new', () => ({
  NewIncidentReportPage: () => (
    <div data-testid='new-incident-report-page' />
  )
}))

describe('NewIncidentReportPage test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'reporting' }
    const NewIncidentReportPage =
      require('@/src/pages/covers/[coverId]/new-report/index').default
    const { initialRender } = initiateTest(NewIncidentReportPage)
    initialRender()
  })

  test('Should display incident report page', () => {
    const newIncidentReportPage = screen.getByTestId(
      'new-incident-report-page'
    )
    expect(newIncidentReportPage).toBeInTheDocument()
  })
})
