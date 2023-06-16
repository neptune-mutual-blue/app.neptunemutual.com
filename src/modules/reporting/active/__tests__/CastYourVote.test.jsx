import { CastYourVote } from '@/modules/reporting/active/CastYourVote'
import { convertFromUnits } from '@/utils/bn'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const incidentReport = {
  data: {
    incidentReport: {
      id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1661159947',
      coverKey:
        '0x6465666900000000000000000000000000000000000000000000000000000000',
      productKey:
        '0x31696e6368000000000000000000000000000000000000000000000000000000',
      incidentDate: '1661159947',
      resolutionDeadline: '0',
      resolved: false,
      resolveTransaction: null,
      emergencyResolved: false,
      emergencyResolveTransaction: null,
      finalized: false,
      status: 'Reporting',
      decision: null,
      resolutionTimestamp: '1661160247',
      claimBeginsFrom: '0',
      claimExpiresAt: '0',
      reporter: '0x201bcc0d375f10543e585fbb883b36c715c959b3',
      reporterInfo:
        '0x5c69ee1c0f7c6efe418b3ce8431349fa01b2fd484bd1115bdb88fcc13f3e93d0',
      reporterStake: '2000000000000000000000',
      disputer: null,
      disputerInfo: '0x00000000',
      disputerStake: null,
      totalAttestedStake: '2000000000000000000000',
      totalAttestedCount: '1',
      totalRefutedStake: '0',
      totalRefutedCount: '0',
      reportTransaction: {
        id: '0x15c867159b08151e66ef80296d7dfe666f4d76717eb5ab8a982df832215f1054',
        timestamp: '1661159947'
      },
      disputeTransaction: null,
      reportIpfsData:
        '{\n  "title": "test",\n  "observed": "2022-08-14T09:18:00.000Z",\n  "proofOfIncident": "[\\"\\"]",\n  "description": "",\n  "stake": "2000000000000000000000",\n  "createdBy": "0x201Bcc0d375f10543e585fbB883B36c715c959B3",\n  "permalink": "https://app.neptunemutual.com/covers/view/0x6465666900000000000000000000000000000000000000000000000000000000/reporting/1660468680000"\n}',
      disputeIpfsData: null
    }
  }
}

describe('CastYourVote test', () => {
  const { initialRender, rerenderFn } = initiateTest(CastYourVote, {
    incidentReport: incidentReport.data.incidentReport,
    minReportingStake: '0'
  })

  beforeEach(() => {
    i18n.activate('en')
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useVote()
    // mockHooksOrMethods.useCoverStatsContext()
    mockHooksOrMethods.useTokenDecimals()

    initialRender()
  })

  test("should render 'Cast Your Vote'", () => {
    const castText = screen.getByText(/Cast Your Vote/i)
    expect(castText).toBeInTheDocument()
  })

  test('should render radio group with two radios', () => {
    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBe(2)
    fireEvent.click(radios[1])
  })

  test('should have input with max available balance when clicking on max button', () => {
    const maxButton = screen.getAllByRole('button')
    expect(maxButton[0]).toHaveTextContent('Max')
    fireEvent.click(maxButton[0])
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue(
      convertFromUnits(testData.castYourVote.balance.toString()).toString()
    )
  })

  test('should show Fetching balance if loadingBalance is true', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useVote(() => {
        return {
          ...testData.castYourVote,
          loadingBalance: true
        }
      })
    })

    const text = screen.getByText(/Fetching balance/)
    expect(text).toBeInTheDocument()
  })

  test("should show 'Fetching allowance' if loadingAllowance is true", () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useVote(() => {
        return {
          ...testData.castYourVote,
          loadingAllowance: true
        }
      })
    })

    const text = screen.getByText(/Fetching allowance.../)
    expect(text).toBeInTheDocument()
  })

  test('should fire change event on text input', () => {
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '200' } })
    const maxBalance = screen.getByText(/Exceeds maximum balance/i)
    expect(maxBalance).toBeInTheDocument()
    fireEvent.change(input, { target: { value: '0' } })
    const insufficientBal = screen.getByText(/Insufficient Balance/i)
    expect(insufficientBal).toBeInTheDocument()
  })

  test('should show reporting and call handle reporting onclicking report', () => {
    const reportButton = screen.getAllByRole('button')
    expect(reportButton[3]).toHaveTextContent('Report')
    fireEvent.click(reportButton[3])
  })
})
