import {
  NewDisputeReportForm
} from '@/src/modules/reporting/NewDisputeReportForm'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@testing-library/react'

describe('Incident Occurred form', () => {
  const { initialRender, rerenderFn } = initiateTest(
    NewDisputeReportForm,
    {
      incidentReport: { coverKey: 'coverKey' },
      minReportingStake: testData.coversAndProducts2.data.minReportingStake
    },
    () => {
      mockHooksOrMethods.useDisputeIncident()
      mockHooksOrMethods.useTokenDecimals()
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the Dispute Report form with the default states', () => {
    const form = screen.getByTestId('dispute-report-form')
    expect(form).toBeInTheDocument()

    const title = screen.getByRole('textbox', { name: 'Title' })
    expect(title).not.toBeRequired()
    expect(title).toBeInTheDocument()

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
      const stake = screen.getByRole('textbox', { name: 'Enter your stake' })
      fireEvent.change(stake, { target: { value: '20' } })
      expect(stake).toHaveDisplayValue('20')

      const buttonApproved = screen.getByRole('button', {
        name: 'Approve NPM'
      })
      fireEvent.click(buttonApproved)
    })

    test('Submit dispute', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useDisputeIncident(() => {
          return {
            ...testData.disputeIncident,
            canDispute: true
          }
        })
      })

      const title = screen.getByRole('textbox', { name: 'Title' })
      fireEvent.change(title, { target: { value: 'Test Title' } })
      expect(title).toHaveDisplayValue('Test Title')

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
        name: 'Dispute'
      })
      fireEvent.click(buttonApproved)
    })

    test('Submit report with multiple url reports', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useDisputeIncident(() => {
          return {
            ...testData.disputeIncident,
            canDispute: true
          }
        })
      })

      const title = screen.getByRole('textbox', { name: 'Title' })
      fireEvent.change(title, { target: { value: 'Test Title' } })
      expect(title).toHaveDisplayValue('Test Title')

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
        name: 'Dispute'
      })
      fireEvent.click(buttonApproved)
    })
  })

  describe('Form state based on candispute', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useDisputeIncident(() => {
        return {
          ...testData.disputeIncident,
          canDispute: true
        }
      })
    })

    const title = screen.getByRole('textbox', { name: 'Title' })
    expect(title).toBeRequired()
    expect(title).toBeInTheDocument()

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

  describe('Approve and Dispute Button', () => {
    test('Show Approving', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useDisputeIncident(() => {
          return {
            ...testData.disputeIncident,
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
        mockHooksOrMethods.useDisputeIncident(() => {
          return {
            ...testData.disputeIncident,
            canDispute: true
          }
        })
      })

      const report = screen.getByRole('button', { name: 'Dispute' })
      expect(report).toBeInTheDocument()
    })

    test('Show Disputing Button', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useDisputeIncident(() => {
          return {
            ...testData.disputeIncident,
            canDispute: true,
            disputing: true
          }
        })
      })

      const report = screen.getByRole('button', { name: 'Disputing...' })
      expect(report).toBeInTheDocument()
      expect(report).toBeInTheDocument()
    })
  })

  describe('Errors on Stake', () => {
    test('Show error Insufficient Stake', () => {
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
      fireEvent.change(stakeInput, { target: { value: 100000 } })

      const error = screen.getByText('Insufficient Balance')
      expect(error).toHaveClass('text-FA5C2F')
      expect(error).toBeInTheDocument()
    })
  })
})
