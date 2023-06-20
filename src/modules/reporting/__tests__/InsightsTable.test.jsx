import { InsightsTable } from '@/modules/reporting/InsightsTable'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { createMockRouter } from '@/utils/unit-tests/createMockRouter'
import { testData } from '@/utils/unit-tests/test-data'
import { render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const incidentReport = testData.incidentReports.data

const router = createMockRouter()

const successinsights = [
  {
    title: 'Incident Occurred',
    value: '43%',
    variant: 'success'
  },
  {
    title: 'User Votes:',
    value: incidentReport.totalAttestedCount
  },
  {
    title: 'Stake:',
    value: formatCurrency(
      convertFromUnits(incidentReport.totalAttestedStake),
      router.locale,
      'NPM',
      true
    ).short,
    htmlTooltip: formatCurrency(
      convertFromUnits(incidentReport.totalAttestedStake),
      router.locale,
      'NPM',
      true
    ).long
  },
  {
    title: 'Your Stake',
    value: formatCurrency(
      convertFromUnits(0),
      router.locale,
      'NPM',
      true
    ).short,
    htmlTooltip: formatCurrency(
      convertFromUnits(0),
      router.locale,
      'NPM',
      true
    ).long
  }
]

const errorinsights = [
  {
    title: 'False Reporting',
    value: '57%',
    variant: 'error'
  },
  {
    title: 'User Votes:',
    value: incidentReport.totalRefutedCount
  },
  {
    title: 'Stake:',
    value: `${
      formatCurrency(
        convertFromUnits(incidentReport.totalRefutedStake),
        router.locale,
        'NPM',
        true
      ).short
    }`,
    htmlTooltip: `${
      formatCurrency(
        convertFromUnits(incidentReport.totalRefutedStake),
        router.locale,
        'NPM',
        true
      ).long
    }`
  },
  {
    title: 'Your Stake',
    value: formatCurrency(
      convertFromUnits(0),
      router.locale,
      'NPM',
      true
    ).short,
    htmlTooltip: formatCurrency(
      convertFromUnits(0),
      router.locale,
      'NPM',
      true
    ).long
  }
]

describe('InsightsTable test', () => {
  beforeEach(() => {
    i18n.activate('en')
  })

  test('should render the Insights table as green when variant is success', () => {
    const screen = render(<InsightsTable insights={successinsights} />)
    const wrapper = screen.getByRole('table')
    const successClass = screen.container.getElementsByClassName('text-0FB88F')
    expect(wrapper).toBeInTheDocument()
    expect(successClass.length).toBe(1)
  })

  test('should render the Insights table as green when variant is success', () => {
    const screen = render(<InsightsTable insights={errorinsights} />)
    const wrapper = screen.getByRole('table')
    const successClass = screen.container.getElementsByClassName('text-FA5C2F')
    expect(wrapper).toBeInTheDocument()
    expect(successClass.length).toBe(1)
  })
})
