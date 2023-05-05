import {
  HorizontalChartLegend
} from '@/modules/reporting/HorizontalChartLegend'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import {
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('HorizontalChartLegend test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useAppConstants()
    // mockHooksOrMethods.useCoverOrProductData()
  })

  test('should render the Incident Occurred legend', () => {
    render(<HorizontalChartLegend />)
    const wrapper = screen.getByText(/Incident Occurred/i)
    expect(wrapper).toBeInTheDocument()
  })
})
