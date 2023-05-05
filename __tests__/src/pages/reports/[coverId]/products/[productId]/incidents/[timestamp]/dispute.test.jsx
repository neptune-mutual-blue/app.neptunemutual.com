import DateLib from '@/lib/date/DateLib'
import { isFeatureEnabled } from '@/src/config/environment'
import DisputeFormPage
  from '@/src/pages/reports/[coverId]/products/[productId]/incidents/[timestamp]/dispute'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import {
  initiateTest
} from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

const mock = jest.spyOn({ isFeatureEnabled }, 'isFeatureEnabled')

jest.mock('@/src/modules/reporting/ReportingHero', () => {
  return {
    ReportingHero: () => {
      return <div data-testid='reporting-hero' />
    }
  }
})

jest.mock('@/src/modules/reporting/NewDisputeReportForm', () => {
  return {
    NewDisputeReportForm: () => {
      return <div data-testid='new-dispute-report-form' />
    }
  }
})

describe('DisputeFormPage test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    DisputeFormPage,
    {},
    () => {
      // mockHooksOrMethods.useCoverOrProductData()
      mockHooksOrMethods.useFetchReport(() => ({
        data: { incidentReport: false },
        loading: true
      }))
      mock.mockImplementation(() => true)
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should display DisputeFormPage with loading text', () => {
    const incident = screen.getByText('loading...')
    expect(incident).toBeInTheDocument()
  })

  test('should display DisputeFormPage with loading text coverInfo', () => {
    // rerenderFn({}, () => {
    //   mockHooksOrMethods.useCoverOrProductData(() => null)
    // })
    const incident = screen.getByText('loading...')
    expect(incident).toBeInTheDocument()
  })

  test('should display DisputeFormPage with no data found', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useFetchReport(() => ({
        data: {
          incidentReport: false
        },
        loading: false
      }))
    })
    const incident = screen.getByText('No data found')
    expect(incident).toBeInTheDocument()
  })

  test('should display DisputeFormPage with NewDisputeReportForm with Not applicable for disputing', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useFetchReport(() => ({
        data: {
          incidentReport: {
            resolutionTimestamp: DateLib.unix()
          }
        },
        loading: true
      }))
    })
    const incident = screen.getByText('Not applicable for disputing')
    expect(incident).toBeInTheDocument()
  })

  test('should display DisputeFormPage with NewDisputeReportForm with NewDisputeReportForm component', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useFetchReport(() => ({
        data: {
          incidentReport: {
            resolutionTimestamp: DateLib.unix() + 36000,
            totalRefutedCount: '0'
          }
        },
        loading: true
      }))
    })
    const dispute = screen.getByTestId('new-dispute-report-form')
    expect(dispute).toBeInTheDocument()
  })
})
