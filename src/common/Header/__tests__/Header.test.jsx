import { Header } from '@/common/Header/Header'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@testing-library/react'

describe('Header test', () => {
  const { initialRender } = initiateTest(Header, {}, () => {
    mockHooksOrMethods.useRouter({
      ...testData.router,
      events: {
        on: jest.fn((...args) => { return args[1]() }),
        off: jest.fn(),
        emit: jest.fn()
      }
    })
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useAuth()
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render logo', () => {
    const logos = screen.getAllByTestId('header-logo')
    expect(logos[0]).toBeInTheDocument()
  })

  test('should render account details modal when clicking on acount', () => {
    const text = screen.getByText(/account details/i)
    fireEvent.click(text)

    const modals = screen.getAllByRole('dialog')
    expect(modals.length).toBe(1)

    const disconnect = screen.getByText(/Disconnect/i)
    fireEvent.click(disconnect)
  })

  test('should display transaction popup', () => {
    const button = screen.getByTestId('transaction-modal-button')

    expect(button).toHaveTextContent('transaction overview button')
    fireEvent.click(button)

    const dialog = screen.getByTestId('transaction-modal')
    expect(dialog).toBeInTheDocument()
  })
})
