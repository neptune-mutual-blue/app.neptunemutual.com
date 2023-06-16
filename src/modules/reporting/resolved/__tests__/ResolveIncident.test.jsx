import { ResolveIncident } from '@/modules/reporting/resolved/ResolveIncident'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import {
  initiateTest
} from '@/utils/unit-tests/helpers'
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
      resolved: true,
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

const incidentReportResolve = {
  data: {
    incidentReport: {
      id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1661159947',
      coverKey:
        '0x6465666900000000000000000000000000000000000000000000000000000000',
      productKey:
        '0x31696e6368000000000000000000000000000000000000000000000000000000',
      incidentDate: '1661159947',
      resolutionDeadline: '0',
      resolved: true,
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

const bb8Report = {
  data: {
    incidentReport: {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1660893112',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000000',
      productKey:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      incidentDate: '1660893112',
      resolutionDeadline: '0',
      resolved: false,
      resolveTransaction: null,
      emergencyResolved: false,
      emergencyResolveTransaction: null,
      finalized: false,
      status: 'Reporting',
      decision: null,
      resolutionTimestamp: '1660894912',
      claimBeginsFrom: '0',
      claimExpiresAt: '0',
      reporter: '0x9bdae2a084ec18528b78e90b38d1a67c79f6cab6',
      reporterInfo:
        '0xf90d9d2af7a10f498da9e79e6f0254489051928b6c120549b854ca037ac653a3',
      reporterStake: '5000000000000000000000',
      disputer: null,
      disputerInfo: '0x00000000',
      disputerStake: null,
      totalAttestedStake: '5000000000000000000000',
      totalAttestedCount: '1',
      totalRefutedStake: '0',
      totalRefutedCount: '0',
      reportTransaction: {
        id: '0x06250c8a425a2114750b04bae0b80af07c207e8a5fee5c573ee2a6340cb8206e',
        timestamp: '1660893112'
      },
      disputeTransaction: null,
      reportIpfsData:
        '{\n  "title": "bb8 test report",\n  "observed": "2022-08-11T07:10:00.000Z",\n  "proofOfIncident": "[\\"https://google.com\\"]",\n  "description": "this is a test report.",\n  "stake": "5000000000000000000000",\n  "createdBy": "0x9BDAE2a084EC18528B78e90b38d1A67c79F6Cab6",\n  "permalink": "https://app.neptunemutual.com/covers/view/0x6262382d65786368616e67650000000000000000000000000000000000000000/reporting/1660201800000"\n}',
      disputeIpfsData: null
    }
  }
}

describe('ResolveIncident loading', () => {
  const props = {
    refetchInfo: jest.fn(),
    refetchReport: jest.fn(),
    incidentReport: incidentReport.data.incidentReport,
    resolvableTill: incidentReport.data.resolutionDeadline
  }

  const initialMocks = () => {
    i18n.activate('en')
    mockHooksOrMethods.useResolveIncident()
    // mockHooksOrMethods.useCoverOrProductData(() => null)
    mockHooksOrMethods.useWeb3React(() => {
      return {
        account: '0xfFA88cb1bbB771aF326E6DFd9E0E8eA3E4E0E603'
      }
    })
  }

  const { initialRender, rerenderFn } = initiateTest(ResolveIncident, props, initialMocks)

  beforeEach(() => { // everything resets (all initial props and mocks), runs before every test()
    mockHooksOrMethods.useAppConstants()
    initialRender()
  })

  test('should render CountDownTimer component if incident is resolved', () => {
    const countdownElement = screen.getByTestId('countdown-timer-component')
    expect(countdownElement).toBeInTheDocument()
  })

  test('should not render CountDownTimer component if incident is not resolved', () => {
    const newProps = Object.create(props)
    newProps.incidentReport.resolved = false
    rerenderFn(newProps) // only affects this test()

    const countdownElement = screen.queryByTestId('countdown-timer-component')
    expect(countdownElement).not.toBeInTheDocument()
  })

  test('Resolve button should not be shown if `resolved` is true', () => {
    const resolveButton = screen.queryByTestId('resolve-button')
    expect(resolveButton).not.toBeInTheDocument()
  })
})

describe('ResolveIncident test resolve', () => {
  const props = {
    refetchInfo: jest.fn(),
    refetchReport: jest.fn(),
    incidentReport: incidentReportResolve.data.incidentReport,
    resolvableTill: incidentReportResolve.data.resolutionDeadline
  }

  const initialMocks = () => {
    i18n.activate('en')
    // mockHooksOrMethods.useCoverOrProductData()
    mockHooksOrMethods.useWeb3React(() => {
      return {
        account: '0xfFA88cb1bbB771aF326E6DFd9E0E8eA3E4E0E603'
      }
    })
  }

  const { initialRender } = initiateTest(ResolveIncident, props, initialMocks)

  beforeEach(() => {
    mockHooksOrMethods.useAppConstants()
    initialRender()
  })

  test('should render a button', () => {
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(1)
  })

  test('should show emergency resolve ', () => {
    const resolveButton = screen.getAllByRole('button')
    expect(resolveButton[0]).toHaveTextContent('Emergency resolve')
  })
})

describe('ResolveIncident test', () => {
  const props = {
    refetchInfo: jest.fn(),
    refetchReport: jest.fn(),
    incidentReport: bb8Report.data.incidentReport,
    resolvableTill: bb8Report.data.resolutionDeadline
  }

  const initialMocks = () => {
    i18n.activate('en')
    mockHooksOrMethods.useResolveIncident()
    // mockHooksOrMethods.useCoverOrProductData()
    mockHooksOrMethods.useWeb3React(() => {
      return {
        account: '0xfFA88cb1bbB771aF326E6DFd9E0E8eA3E4E0E603'
      }
    })
  }

  const { initialRender } = initiateTest(ResolveIncident, props, initialMocks)

  beforeEach(() => {
    initialRender()
    const button = screen.getAllByRole('button')
    fireEvent.click(button[1])
  })

  test('should render modal ', async () => {
    const emergencyModal = screen.getByRole('dialog')
    expect(emergencyModal).toBeTruthy()
  })

  test("should have 'you will receive' text", () => {
    const selectText = screen.getByText(/SELECT YOUR DECISION/i)
    expect(selectText).toBeInTheDocument()
  })

  test('should close the modal when clikcing on close', () => {
    const closeButton = screen.getByTestId('modal-close-button')
    fireEvent.click(closeButton)
    expect(screen.queryByRole('dialog')).toBe(null)
  })

  test('should have two radio buttons', () => {
    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBe(2)
    fireEvent.click(radios[1])
  })

  test('should show unstaking after clicking on dialog button', () => {
    const wrapper = screen.getByRole('dialog')
    const emergencyResolve = wrapper.getElementsByTagName('button')
    expect(emergencyResolve[0]).toHaveTextContent('Emergency resolve')
    fireEvent.click(emergencyResolve[0])
  })
})
