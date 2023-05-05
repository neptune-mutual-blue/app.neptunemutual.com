import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'
import IncidentResolvedCoverPage from '@/src/pages/reports/[coverId]/products/[productId]/incidents/[timestamp]/details'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

jest.mock('@/src/modules/reporting/details', () => {
  return {
    ReportingDetailsPage: () => {
      return <div data-testid='reporting-details-page' />
    }
  }
})

describe('IncidentResolvedCoverPage test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    IncidentResolvedCoverPage,
    {},
    () => {
      mockHooksOrMethods.useFetchReport(() => ({
        data: false,
        loading: true
      }))
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should display IncidentResolvedCoverPage with loading text', () => {
    const incident = screen.getByText('loading...')
    expect(incident).toBeInTheDocument()
  })

  test('should display IncidentResolvedCoverPage with No data found text', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useFetchReport(() => ({
        data: { incidentReport: false },
        loading: false
      }))
    })
    const incident = screen.getByText('No data found')
    expect(incident).toBeInTheDocument()
  })

  test('should display IncidentResolvedCoverPage with ReportingDetailsPage Component', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useFetchReport(() => ({
        data: { incidentReport: true },
        loading: false
      }))
    })

    const reporting = screen.getByTestId('reporting-details-page')
    expect(reporting).toBeInTheDocument()
  })
})
