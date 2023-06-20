import {
  UnstakeYourAmount
} from '@/modules/reporting/resolved/UnstakeYourAmount'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const incidentReport = testData.incidentReports.data

describe('UnstakeYourAmount test', () => {
  const props = {
    incidentReport: incidentReport,
    willReceive: '0'
  }

  const initialMocks = () => {
    i18n.activate('en')
    // mockHooksOrMethods.useCoverOrProductData()
  }

  const { initialRender } = initiateTest(
    UnstakeYourAmount,
    props,
    initialMocks
  )
  beforeEach(() => {
    initialRender()
  })

  test("should render 'Result:' text", () => {
    const button = screen.getByText(/Result/i)
    expect(button).toBeInTheDocument()
  })

  test('should render unstake button', () => {
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('UNSTAKE')
  })

  test('should render modal ', () => {
    const button = screen.getByRole('button')
    fireEvent.click(button)
    const unstakeModals = screen.getAllByRole('dialog')
    expect(unstakeModals.length).toBe(1)
    const receiveText = screen.getByText(/YOU WILL RECEIVE/i)
    expect(receiveText).toBeInTheDocument()
  })
})

describe('UnstakeYourAmountModal test', () => {
  const props = {
    incidentReport: incidentReport,
    willReceive: '0'
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

  const { initialRender } = initiateTest(
    UnstakeYourAmount,
    props,
    initialMocks
  )
  beforeEach(() => {
    initialRender()
    const button = screen.getByRole('button')
    fireEvent.click(button)
  })

  test('should render modal ', () => {
    const unstakeModals = screen.getAllByRole('dialog')
    expect(unstakeModals.length).toBe(1)
  })

  test("should have 'you will receive' text", () => {
    const receiveText = screen.getByText(/YOU WILL RECEIVE/i)
    expect(receiveText).toBeInTheDocument()
  })

  test('should close the modal when clikcing on close', () => {
    const closeButton = screen.getByTestId('modal-close-button')
    fireEvent.click(closeButton)
    expect(screen.queryByRole('dialog')).toBe(null)
  })

  test('should show unstaking after clicking on dialog button', () => {
    const wrapper = screen.getAllByRole('dialog')[0]
    const modalUnstake = wrapper.getElementsByTagName('button')
    expect(modalUnstake[0]).toHaveTextContent('Unstake')
    fireEvent.click(modalUnstake[0])
  })
})
