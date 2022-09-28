import { AccountDetailsModal } from '@/common/Header/AccountDetailsModal'
import { testData } from '@/utils/unit-tests/test-data'
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { act, fireEvent, screen } from '@testing-library/react'

describe('AccountDetailsModal test', () => {
  const closeFn = jest.fn()
  const handleDisconnect = jest.fn()

  Object.assign(navigator, {
    clipboard: {
      writeText: () => {}
    }
  })

  const { initialRender } = initiateTest(
    AccountDetailsModal,
    {
      isOpen: true,
      onClose: () => closeFn(),
      networkId: testData.network.networkId,
      handleDisconnect: () => handleDisconnect()
    },
    () => {
      mockFn.useUnlimitedApproval()
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render acccount details modal', () => {
    const modals = screen.getAllByRole('dialog')
    expect(modals.length).toBe(2)
  })

  test('should show copied after clicking on copy address', async () => {
    await act(async () => {
      const copyText = screen.getByText(/Copy Address/i)
      await fireEvent.click(copyText)
    })
  })
})
