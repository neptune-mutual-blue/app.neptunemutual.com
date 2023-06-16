import {
  NewDisputeReportFormContainer
} from '@/modules/reporting/NewDisputeReportFormContainer'
import { isFeatureEnabled } from '@/src/config/environment'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

const mock = jest.spyOn({ isFeatureEnabled }, 'isFeatureEnabled')

const props = testData.reporting.activeReporting[0]

describe('DisputeFormPage test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    NewDisputeReportFormContainer,
    {
      coverKey: props.coverKey,
      productKey: props.productKey,
      timestamp: props.incidentDate
    },
    () => {
      mockHooksOrMethods.useCoversAndProducts2()
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should display DisputeFormPage skeleton when loading', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => ({
        ...testData.coversAndProducts2,
        loading: true
      }))
    })
    const incident = screen.getByTestId('dispute-form-loading-skeleton')
    expect(incident).toBeInTheDocument()
  })

  test('should display DisputeFormPage with no data found', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => ({
        ...testData.coversAndProducts2,
        getProduct: () => null,
        getCoverByCoverKey: () => null
      }))
    })
    const noDataFound = screen.getByText('No Data Found')
    expect(noDataFound).toBeInTheDocument()
  })

  test('should display hero container if data available', () => {
    const hero = screen.getByTestId('hero-container')
    expect(hero).toBeInTheDocument()
  })

  test('should display loading skeleton in DisputeForm when loading', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useFetchReport(() => ({
        ...testData.incidentReports,
        loading: true
      }))
    })
    const dispute = screen.getByTestId('dispute-form-loading-skeleton')
    expect(dispute).toBeInTheDocument()
  })

  test('should display No data found text in DisputeForm when no data', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useFetchReport(() => ({
        ...testData.incidentReports,
        data: null
      }))
    })
    const dispute = screen.getByText('No data found')
    expect(dispute).toBeInTheDocument()
  })
})
