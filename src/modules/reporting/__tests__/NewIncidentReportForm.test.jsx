import {
  NewIncidentReportForm
} from '@/src/modules/reporting/NewIncidentReportForm'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@testing-library/react'

describe('Incident Occurred form', () => {
  const { initialRender, rerenderFn } = initiateTest(
    NewIncidentReportForm,
    {
      coverKey: 'coverKey',
      productKey: 'productKey',
      minReportingStake: testData.coversAndProducts2.data.minReportingStake
    },
    () => {
      mockHooksOrMethods.useReportIncident()
      mockHooksOrMethods.useTokenDecimals()
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the Incident Report form with the default states', () => {
    const form = screen.getByTestId('incident-report-form')
    expect(form).toBeInTheDocument()

    const title = screen.getByRole('textbox', { name: 'Title' })
    expect(title).not.toBeRequired()
    expect(title).toBeInTheDocument()

    const observeDateAndTime = screen.getByLabelText('Observed Date & Time')
    expect(observeDateAndTime).not.toBeRequired()
    expect(observeDateAndTime).toBeInTheDocument()

    const proofOfIncident = screen.getByRole('textbox', {
      name: 'Proof of incident'
    })
    expect(proofOfIncident).not.toBeRequired()
    expect(proofOfIncident).toBeInTheDocument()

    const description = screen.getByRole('textbox', { name: 'Description' })
    expect(description).not.toBeRequired()
    expect(description).toBeInTheDocument()

    const stake = screen.getByRole('textbox', { name: 'Enter your stake' })
    expect(stake).toBeRequired()
    expect(stake).toBeInTheDocument()

    const approveNPMButton = screen.getByRole('button', {
      name: 'Approve NPM'
    })
    expect(approveNPMButton).toBeInTheDocument()

    const inputs = screen.getAllByRole('textbox')
    /**
     * Title
     * Observed Date and Time
     * Proof of incident
     */
    expect(inputs.length).toBe(4)

    const buttons = screen.getAllByRole('button')
    /**
     * Add new url Link
     * Copy Address
     * Open In Explorer
     * Add to Metamask
     * Approved NPM
     */
    expect(buttons.length).toBe(5)
  })

  test('Form state based on canreport', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useReportIncident(() => {
        return {
          ...testData.reportIncident,
          canReport: true
        }
      })
    })

    const title = screen.getByRole('textbox', { name: 'Title' })
    expect(title).toBeRequired()
    expect(title).toBeInTheDocument()

    const observeDateAndTime = screen.getByLabelText('Observed Date & Time')
    expect(observeDateAndTime).toBeRequired()
    expect(observeDateAndTime).toBeInTheDocument()

    const proofOfIncident = screen.getByRole('textbox', {
      name: 'Proof of incident'
    })
    expect(proofOfIncident).toBeRequired()
    expect(proofOfIncident).toBeInTheDocument()

    const description = screen.getByRole('textbox', { name: 'Description' })
    expect(description).toBeRequired()
    expect(description).toBeInTheDocument()

    const stake = screen.getByRole('textbox', { name: 'Enter your stake' })
    expect(stake).toBeRequired()
    expect(stake).toBeInTheDocument()
  })

  test('Set Max Balance to stake', () => {
    const max = screen.getByRole('button', { name: 'Max' })
    expect(max).toBeInTheDocument()
    fireEvent.click(max)

    const textBoxStake = screen.getByRole('textbox', {
      name: 'Enter your stake'
    })
    expect(textBoxStake).toHaveDisplayValue('100')
  })

  describe('Form', () => {
    test('Submit approve', () => {
      const title = screen.getByRole('textbox', { name: 'Title' })
      fireEvent.change(title, { target: { value: 'Test Title' } })
      expect(title).toHaveDisplayValue('Test Title')

      const observeDateAndTime = screen.getByLabelText('Observed Date & Time')
      expect(observeDateAndTime).toHaveClass('text-9B9B9B')
      fireEvent.change(observeDateAndTime, {
        target: { value: '2000-01-01T12:00' }
      })
      expect(observeDateAndTime).toHaveDisplayValue('2000-01-01T12:00')
      expect(observeDateAndTime).not.toHaveClass('text-9B9B9B')

      const url = screen.getByRole('textbox', { name: 'Proof of incident' })
      fireEvent.change(url, {
        target: { value: 'https://www.example.com/report' }
      })
      expect(url).toHaveDisplayValue('https://www.example.com/report')

      const description = screen.getByRole('textbox', { name: 'Description' })
      fireEvent.change(description, { target: { value: 'Test Description' } })
      expect(description).toHaveDisplayValue('Test Description')

      const stake = screen.getByRole('textbox', { name: 'Enter your stake' })
      fireEvent.change(stake, { target: { value: '20' } })
      expect(stake).toHaveDisplayValue('20')

      const buttonApproved = screen.getByRole('button', {
        name: 'Approve NPM'
      })
      fireEvent.click(buttonApproved)
    })

    test('Submit report', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useReportIncident(() => {
          return {
            ...testData.reportIncident,
            canReport: true
          }
        })
      })

      const title = screen.getByRole('textbox', { name: 'Title' })
      fireEvent.change(title, { target: { value: 'Test Title' } })
      expect(title).toHaveDisplayValue('Test Title')

      const observeDateAndTime = screen.getByLabelText('Observed Date & Time')
      fireEvent.change(observeDateAndTime, {
        target: { value: '2000-01-01T12:00' }
      })
      expect(observeDateAndTime).toHaveDisplayValue('2000-01-01T12:00')

      const url = screen.getByRole('textbox', { name: 'Proof of incident' })
      fireEvent.change(url, {
        target: { value: 'https://www.example.com/report' }
      })
      expect(url).toHaveDisplayValue('https://www.example.com/report')

      const description = screen.getByRole('textbox', { name: 'Description' })
      fireEvent.change(description, { target: { value: 'Test Description' } })
      expect(description).toHaveDisplayValue('Test Description')

      const stake = screen.getByRole('textbox', { name: 'Enter your stake' })
      fireEvent.change(stake, { target: { value: '20' } })
      expect(stake).toHaveDisplayValue('20')

      const buttonApproved = screen.getByRole('button', {
        name: 'Report'
      })
      fireEvent.click(buttonApproved)
    })

    test('Submit report with multiple url reports', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useReportIncident(() => {
          return {
            ...testData.reportIncident,
            canReport: true
          }
        })
      })

      const title = screen.getByRole('textbox', { name: 'Title' })
      fireEvent.change(title, { target: { value: 'Test Title' } })
      expect(title).toHaveDisplayValue('Test Title')

      const observeDateAndTime = screen.getByLabelText('Observed Date & Time')
      fireEvent.change(observeDateAndTime, {
        target: { value: '2000-01-01T12:00' }
      })
      expect(observeDateAndTime).toHaveDisplayValue('2000-01-01T12:00')

      const btnAddNewUrl = screen.getByRole('button', {
        name: '+ Add new link'
      })

      fireEvent.click(btnAddNewUrl)

      const urls = screen.getAllByPlaceholderText('https://')
      expect(urls.length).toBe(2)

      fireEvent.change(urls[0], {
        target: { value: 'https://www.example.com/report' }
      })
      expect(urls[0]).toHaveDisplayValue('https://www.example.com/report')

      fireEvent.change(urls[1], {
        target: { value: 'https://www.example.com/report_1' }
      })
      expect(urls[1]).toHaveDisplayValue('https://www.example.com/report_1')

      const description = screen.getByRole('textbox', { name: 'Description' })
      fireEvent.change(description, { target: { value: 'Test Description' } })
      expect(description).toHaveDisplayValue('Test Description')

      const stake = screen.getByRole('textbox', { name: 'Enter your stake' })
      fireEvent.change(stake, { target: { value: '20' } })
      expect(stake).toHaveDisplayValue('20')

      const buttonApproved = screen.getByRole('button', {
        name: 'Report'
      })
      fireEvent.click(buttonApproved)
    })
  })

  describe('Loading test', () => {
    test('loadingAllowance test', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useReportIncident(() => {
          return {
            ...testData.reportIncident,
            loadingAllowance: true
          }
        })
      })

      const loading = screen.getByTestId('loaders')
      expect(loading).toHaveTextContent('Fetching allowance...')
      expect(loading).toBeInTheDocument()
    })

    test('loadingBalance test', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useReportIncident(() => {
          return {
            ...testData.reportIncident,
            loadingBalance: true
          }
        })
      })

      const loading = screen.getByTestId('loaders')
      expect(loading).toHaveTextContent('Fetching balance...')
      expect(loading).toBeInTheDocument()
    })
  })

  describe('Approve and Reporting Button', () => {
    test('Show Approving', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useReportIncident(() => {
          return {
            ...testData.reportIncident,
            approving: true
          }
        })
      })

      const approving = screen.getByRole('button', { name: 'Approving...' })
      expect(approving).toBeInTheDocument()
      expect(approving).toHaveAttribute('disabled', '')
    })

    test('Show Report Button', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useReportIncident(() => {
          return {
            ...testData.reportIncident,
            canReport: true
          }
        })
      })

      const report = screen.getByRole('button', { name: 'Report' })
      expect(report).toBeInTheDocument()
    })

    test('Show Reporting Button', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useReportIncident(() => {
          return {
            ...testData.reportIncident,
            canReport: true,
            reporting: true
          }
        })
      })

      const report = screen.getByRole('button', { name: 'Reporting...' })
      expect(report).toBeInTheDocument()
      expect(report).toBeInTheDocument()
    })
  })

  describe('Errors on Stake', () => {
    test('Show error Insufficient stake', () => {
      const stakeInput = screen.getByRole('textbox', {
        name: 'Enter your stake'
      })
      fireEvent.change(stakeInput, { target: { value: 10 } })

      const error = screen.getByText('Insufficient Stake')
      expect(error).toHaveClass('text-FA5C2F')
      expect(error).toBeInTheDocument()
    })

    test('Show error Insufficient Balance', () => {
      const stakeInput = screen.getByRole('textbox', {
        name: 'Enter your stake'
      })
      fireEvent.change(stakeInput, { target: { value: 1000000 } })

      const error = screen.getByText('Insufficient Balance')
      expect(error).toHaveClass('text-FA5C2F')
      expect(error).toBeInTheDocument()
    })
  })
})
