import { i18n } from '@lingui/core'
import { render, screen } from '@/utils/unit-tests/test-utils'
import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { HorizontalChartLegend } from '@/modules/reporting/HorizontalChartLegend'

describe('HorizontalChartLegend test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockFn.useAppConstants()
    mockFn.useCoverOrProductData()
  })

  test('should render the Incident Occurred legend', () => {
    render(<HorizontalChartLegend />)
    const wrapper = screen.getByText(/Incident Occurred/i)
    expect(wrapper).toBeInTheDocument()
  })
})
