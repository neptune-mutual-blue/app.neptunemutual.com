import { Header } from '@/common/Header/Header'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { fireEvent, screen } from '@testing-library/react'

describe('Header test', () => {
  const { initialRender } = initiateTest(Header, {}, () => {
    mockHooksOrMethods.useRouter({
      ...testData.router,
      events: {
        on: jest.fn((...args) => args[1]()),
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

  test('should render figure', () => {
    const modals = screen.getByRole('figure')
    expect(modals).toBeInTheDocument()
  })

  test('should render account details modal when clicking on acount', () => {
    const text = screen.getByText(/account details/i)
    fireEvent.click(text)

    const modals = screen.getAllByRole('dialog')
    expect(modals.length).toBe(2)

    const disconnect = screen.getByText(/Disconnect/i)
    fireEvent.click(disconnect)
  })

  test('should display transaction popup', () => {
    const buttons = screen.getAllByRole('button')

    expect(buttons[3]).toHaveTextContent('transaction overview button')
    fireEvent.click(buttons[3])

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })
})
