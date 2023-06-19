import ReportComments from '@/modules/reporting/ReportComments'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { screen } from '@testing-library/react'

const oneHourToMilliseconds = 3600000
const currentTime = new Date().getTime()

describe('Incident Occurred', () => {
  const plus3HoursToCurrentTime = Math.floor(
    new Date(currentTime + oneHourToMilliseconds * 3).getTime() / 1000
  )

  const { initialRender } = initiateTest(ReportComments, {
    reportIpfsHash: 'dummy',
    disputeIpfsHash: 'dummy-dispute',
    reportIpfsDataTimeStamp: plus3HoursToCurrentTime,
    disputeIpfsDataTimeStamp: null
  })

  beforeEach(() => {
    mockHooksOrMethods.ipfs.readFromIpfs((hash) => {
      return hash === 'dummy'
        ? JSON.parse('{\n  "title": "This is test title incident",\n  "observed": "2022-08-09T03:26:00.000Z",\n  "proofOfIncident": "[\\"https://www.example.com/incident\\"]",\n  "description": "Lorem Ipsum is ismply dummy text of the printingand type setting industry. Lorem ipsum has been the industry standard dummy text",\n  "stake": "2000000000000000000000",\n  "createdBy": "0x65E06B1bCF7B91974a15e5178F8aA74Dee29b7C9",\n  "permalink": "https://app.neptunemutual.com/covers/view/0x7072696d65000000…000000000000000000000000000000000000/reporting/1660015560000"\n}')
        : undefined
    }

    )
    initialRender()
  })

  test('should render the incident report title, description, address, and time', () => {
    const headerType = screen.getByTestId('header-type')
    expect(headerType).toHaveTextContent('Reported by')
    expect(headerType).toBeInTheDocument()

    const address = screen.getByTestId('address')
    expect(address).toHaveTextContent(
      '0x65E06B1bCF7B91974a15e5178F8aA74Dee29b7C9'
    )
    expect(address).toBeInTheDocument()

    const reportedAt = screen.getByTestId('reported-at')
    expect(reportedAt).toHaveTextContent('3 hours')
    expect(reportedAt).toBeInTheDocument()

    const reportType = screen.getByTestId('report-type')
    expect(reportType).toHaveTextContent('Incident Occurred')
    expect(reportType).toHaveClass('bg-21AD8C')
    expect(reportType).toBeInTheDocument()

    const reportTitle = screen.getByTestId('title')
    expect(reportTitle).toHaveTextContent('This is test title incident')
    expect(reportTitle).toBeInTheDocument()

    const reportContent = screen.getByTestId('desc')
    expect(reportContent).toHaveTextContent(
      'Lorem Ipsum is ismply dummy text of the printingand type setting industry. Lorem ipsum has been the industry standard dummy text'
    )
    expect(reportContent).toBeInTheDocument()
  })
})

describe('Incident Occurred and False Reporting', () => {
  const plus3HoursToCurrentTime = Math.floor(
    new Date(currentTime + oneHourToMilliseconds * 3).getTime() / 1000
  )

  const plus2HoursToCurrentTime = Math.floor(
    new Date(currentTime + oneHourToMilliseconds * 2).getTime() / 1000
  )

  const { initialRender } = initiateTest(ReportComments, {
    reportIpfsHash: 'dummy',
    disputeIpfsHash: 'dummy-dispute',
    reportIpfsDataTimeStamp: plus3HoursToCurrentTime,
    disputeIpfsDataTimeStamp: plus2HoursToCurrentTime

  })

  beforeEach(() => {
    mockHooksOrMethods.ipfs.readFromIpfs((hash) => {
      return hash === 'dummy'
        ? JSON.parse('{\n  "title": "This is a test 1inch incident",\n  "observed": null,\n  "proofOfIncident": "[\\"https://www.example.com/incident\\"]",\n  "description": "This is a test example incident please ingore",\n  "stake": "2000000000000000000000",\n  "createdBy": "0x65E06B1bCF7B91974a15e5178F8aA74Dee29b7C9",\n  "permalink": "https://app.neptunemutual.com/covers/view/0x6465666900000000…0000000000000000000000000000000000000000000000/reporting/NaN"\n}')
        : JSON.parse('{\n  "title": "Dispute ",\n  "proofOfIncident": "[\\"https://www.example.com/dispute\\"]",\n  "description": "testing this is dispute",\n  "stake": "2000000000000000000000",\n  "createdBy": "0xAE55A2fA7621093fa5e89aBf410955764AC1d92b"\n}')
    }

    )
    initialRender()
  })

  test('should render the incident report title, description, address, and time', () => {
    const dispute = screen.getByTestId('dispute')
    expect(dispute).toBeInTheDocument()

    const headerType = screen.getAllByTestId('header-type')
    expect(headerType[0]).toHaveTextContent('Reported by')
    expect(headerType[1]).toHaveTextContent('Disputed by')
    expect(headerType[0]).toBeInTheDocument()
    expect(headerType[1]).toBeInTheDocument()

    const address = screen.getAllByTestId('address')
    expect(address[0]).toHaveTextContent(
      '0x65E06B1bCF7B91974a15e5178F8aA74Dee29b7C9'
    )
    expect(address[1]).toHaveTextContent(
      '0xAE55A2fA7621093fa5e89aBf410955764AC1d92b'
    )
    expect(address[0]).toBeInTheDocument()
    expect(address[1]).toBeInTheDocument()

    const reportedAt = screen.getAllByTestId('reported-at')
    expect(reportedAt[0]).toHaveTextContent('3 hours')
    expect(reportedAt[1]).toHaveTextContent('2 hours')
    expect(reportedAt[0]).toBeInTheDocument()
    expect(reportedAt[1]).toBeInTheDocument()

    const reportType = screen.getAllByTestId('report-type')
    expect(reportType[0]).toHaveTextContent('Incident Occurred')
    expect(reportType[1]).toHaveTextContent('False Reporting')
    expect(reportType[0]).toHaveClass('bg-21AD8C')
    expect(reportType[1]).toHaveClass('bg-FA5C2F')
    expect(reportType[0]).toBeInTheDocument()
    expect(reportType[1]).toBeInTheDocument()

    const reportTitle = screen.getAllByTestId('title')
    expect(reportTitle[0]).toHaveTextContent('This is a test 1inch incident')
    expect(reportTitle[1]).toHaveTextContent('Dispute')
    expect(reportTitle[0]).toBeInTheDocument()
    expect(reportTitle[1]).toBeInTheDocument()

    const reportContent = screen.getAllByTestId('desc')
    expect(reportContent[0]).toHaveTextContent(
      'This is a test example incident please ingore'
    )
    expect(reportContent[1]).toHaveTextContent('testing this is dispute')
    expect(reportContent[0]).toBeInTheDocument()
    expect(reportContent[1]).toBeInTheDocument()
  })
})
