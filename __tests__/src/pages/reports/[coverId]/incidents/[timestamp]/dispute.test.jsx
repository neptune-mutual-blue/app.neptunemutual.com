// import DateLib from '@/lib/date/DateLib'
import DisputeFormPage
  from '@/src/pages/reports/[coverId]/incidents/[timestamp]/dispute'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

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
      mockHooksOrMethods.useCoversAndProducts2()
      mockHooksOrMethods.useFetchReport(() => ({
        data: { incidentReport: false },
        loading: true
      }))
    }
  )

  beforeEach(() => {
    initialRender()
  })

  // test('should display DisputeFormPage with loading text', () => {
  //   const incident = screen.getByText('loading...')
  //   expect(incident).toBeInTheDocument()
  // })

  // test('should display DisputeFormPage with loading text coverInfo', () => {
  //   rerenderFn({}, () => {
  //     mockHooksOrMethods.useCoversAndProducts2(() => null)
  //   })
  //   const incident = screen.getByText('loading...')
  //   expect(incident).toBeInTheDocument()
  // })

  test('should display DisputeFormPage with no data found', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => ({ ...testData.coversAndProducts2, data: [] }))
      // mockHooksOrMethods.useFetchReport(() => ({
      //   data: {
      //     incidentReport: false
      //   },
      //   loading: false
      // }))
    })
    const incident = screen.getByText('No Data Found')
    expect(incident).toBeInTheDocument()
  })

  // test('should display DisputeFormPage with NewDisputeReportForm with Not applicable for disputing', () => {
  //   rerenderFn({}, () => {
  //     mockHooksOrMethods.useFetchReport(() => ({
  //       data: {
  //         incidentReport: {
  //           resolutionTimestamp: DateLib.unix()
  //         }
  //       },
  //       loading: true
  //     }))
  //   })
  //   const incident = screen.getByText('Not applicable for disputing')
  //   expect(incident).toBeInTheDocument()
  // })

  // test('should display DisputeFormPage with NewDisputeReportForm with NewDisputeReportForm component', () => {
  //   rerenderFn({}, () => {
  //     mockHooksOrMethods.useFetchReport(() => ({
  //       data: {
  //         incidentReport: {
  //           resolutionTimestamp: DateLib.unix() + 36000,
  //           totalRefutedCount: '0'
  //         }
  //       },
  //       loading: true
  //     }))
  //   })
  //   const dispute = screen.getByTestId('new-dispute-report-form')
  //   expect(dispute).toBeInTheDocument()
  // })
})
