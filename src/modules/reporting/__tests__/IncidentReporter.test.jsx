import { IncidentReporter } from '@/modules/reporting/IncidentReporter'
import { truncateAddressParam } from '@/utils/address'
import { testData } from '@/utils/unit-tests/test-data'
import { render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('IncidentReporter test', () => {
  beforeEach(() => {
    i18n.activate('en')
  })

  test('should render the Incident Reporter as green when variant is success', () => {
    const incidentReport = testData.incidentReports.data
    const screen = render(
      <IncidentReporter
        variant='success'
        account={truncateAddressParam(incidentReport.reporter, 8, -6)}
        txHash={incidentReport.reportTransaction.id}
      />
    )
    const wrapper = screen.getByText(
      truncateAddressParam(incidentReport.reporter, 8, -6)
    )
    const successClass = screen.container.getElementsByClassName('bg-21AD8C')
    expect(wrapper).toBeInTheDocument()
    expect(successClass.length).toBeGreaterThanOrEqual(1)
  })

  test('should render the Incident Reporter as orange when variant is error', () => {
    const incidentReport = testData.incidentReports.data
    const screen = render(
      <IncidentReporter
        variant='error'
        account={truncateAddressParam(incidentReport.reporter, 8, -6)}
        txHash={incidentReport.reportTransaction.id}
      />
    )
    const wrapper = screen.getByText(
      truncateAddressParam(incidentReport.reporter, 8, -6)
    )
    const errorClass = screen.container.getElementsByClassName('bg-FA5C2F')
    expect(wrapper).toBeInTheDocument()
    expect(errorClass.length).toBeGreaterThanOrEqual(1)
  })
})
