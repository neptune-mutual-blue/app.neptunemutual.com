import DateLib from '@/lib/date/DateLib'
import {
  WithdrawLiquidityForm
} from '@/modules/my-liquidity/content/WithdrawLiquidityForm'
import { convertToUnits } from '@/utils/bn'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@testing-library/react'

describe('WithdrawLiquidityForm', () => {
  const props = {
    setModalDisabled: jest.fn()
  }
  const { initialRender, rerenderFn } = initiateTest(
    WithdrawLiquidityForm,
    props,
    () => {
      mockHooksOrMethods.useRouter(() => {
        return {
          ...testData.router,
          query: {
            coverId: '0x1234567890123456789012345678901234567890'
          },
          locale: 'en'
        }
      })
      mockHooksOrMethods.useAppConstants()
      mockHooksOrMethods.useCalculateLiquidity()
      mockHooksOrMethods.useLiquidityFormsContext()
      mockHooksOrMethods.useRemoveLiquidity()
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the main containers', () => {
    const inputs = screen.getByTestId('withdraw-liquidity-form-inputs')
    const buttons = screen.getByTestId('withdraw-liquidity-form-buttons')
    expect(inputs).toBeInTheDocument()
    expect(buttons).toBeInTheDocument()
  })

  test('should render npm input field', () => {
    const input = screen.getByTestId('npm-input')
    expect(input).toBeInTheDocument()
  })

  test('should render `Your Stake` prefix if myStake is greater than 0', () => {
    const prefix = screen.getByTestId('my-stake-prefix')
    expect(prefix).toBeInTheDocument()
  })

  test('should not render `Your Stake` prefix if myStake is 0', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useLiquidityFormsContext(() => {
        return {
          ...testData.liquidityFormsContext,
          info: {
            ...testData.liquidityFormsContext.info,
            myStake: '0'
          }
        }
      })
    })

    const prefix = screen.queryByTestId('my-stake-prefix')
    expect(prefix).not.toBeInTheDocument()
  })

  test('should render `Minimum Stake` prefix', () => {
    const prefix = screen.getByTestId('minimum-stake-prefix')
    expect(prefix).toBeInTheDocument()
  })

  test('should not render the npm error message by default', () => {
    const npmError = screen.queryByTestId('npm-error')
    expect(npmError).not.toBeInTheDocument()
  })

  test('should show npm error when error occurs', () => {
    const input = screen.getByTestId('npm-input')
    fireEvent.change(input, { target: { value: '12345' } })
    const npmError = screen.queryByTestId('npm-error')
    expect(npmError).toBeInTheDocument()
  })

  test('should render the pod input field', () => {
    const podInput = screen.getByTestId('pod-input')
    expect(podInput).toBeInTheDocument()
  })

  test('should not render the pod error message by default', () => {
    const podError = screen.queryByTestId('pod-error')
    expect(podError).not.toBeInTheDocument()
  })

  test('should render the pod error message in case of error', () => {
    const podInput = screen.getByTestId('pod-input')
    fireEvent.change(podInput, { target: { value: '0' } })

    const podError = screen.getByTestId('pod-error')
    expect(podError).toBeInTheDocument()
  })

  test('should render the ReceiveInput component', () => {
    const receiveInput = screen.getByTestId('receive-input')
    expect(receiveInput).toBeInTheDocument()
  })

  test('should render correct withdrawl open date', () => {
    const wrapper = screen.getByTestId('open-date')

    const expectedText = DateLib.toLongDateFormat(
      testData.liquidityFormsContext.info.withdrawalOpen,
      'en'
    )
    expect(wrapper.textContent).toContain(expectedText)
  })

  test('should render correct withdrawl close date', () => {
    const wrapper = screen.getByTestId('close-date')

    const expectedText = DateLib.toLongDateFormat(
      testData.liquidityFormsContext.info.withdrawalClose,
      'en'
    )
    expect(wrapper.textContent).toContain(expectedText)
  })

  test('should render the `Withdraw Full Liquidity` checkbox', () => {
    const checkbox = screen.getByTestId('exit-checkbox')
    fireEvent.click(checkbox, { target: { checked: false } })
    expect(checkbox).toBeInTheDocument()
  })

  test('should not render `Wait for accural` text if accural complete', () => {
    const wrapper = screen.queryByText('Wait for accrual')
    expect(wrapper).not.toBeInTheDocument()
  })

  test('should show `Wait for accural` text if accural not complete', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useLiquidityFormsContext(() => {
        return {
          ...testData.liquidityFormsContext,
          info: {
            ...testData.liquidityFormsContext.info,
            isAccrualComplete: false
          }
        }
      })
    })
    const wrapper = screen.queryByText('Wait for accrual')
    expect(wrapper).toBeInTheDocument()
  })

  test('should show loadingMessage', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCalculateLiquidity({
        ...testData.calculateLiquidity,
        loading: true
      })
    })

    expect(screen.getByText(/Calculating tokens/i)).toBeInTheDocument()
  })

  describe('Approve Button', () => {
    test('should show approve button', () => {
      const button = screen.getByTestId('approve-button')
      expect(button).toBeInTheDocument()
    })

    test('should show correct text in approve button', () => {
      let button = screen.getByTestId('approve-button')
      expect(button.textContent).toBe('Approve')

      rerenderFn({}, () => {
        mockHooksOrMethods.useRemoveLiquidity(() => {
          return {
            ...testData.removeLiquidity,
            approving: true
          }
        })
      })
      button = screen.getByTestId('approve-button')
      expect(button.textContent).toBe('Approving...')
    })

    test('should disable the approve button when approving', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useRemoveLiquidity(() => {
          return {
            ...testData.removeLiquidity,
            approving: true
          }
        })
      })
      const button = screen.getByTestId('approve-button')
      expect(button).toHaveAttribute('disabled')
    })

    // test("simulating approve button click", () => {
    //   const button = screen.getByTestId("approve-button");
    //   fireEvent.click(button);
    //   // console.log({ attr: button.getAttributeNames() });
    //   expect(testData.removeLiquidity.handleApprove).toHaveBeenCalled();
    // });
  })

  describe('Withdraw Button', () => {
    beforeEach(() => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useRemoveLiquidity(() => {
          return {
            ...testData.removeLiquidity,
            allowance: convertToUnits('1000').toString()
          }
        })
      })
      const podInput = screen.getByTestId('pod-input')
      fireEvent.change(podInput, { target: { value: '1000' } })
    })

    test('should show withdraw button after approval complete', () => {
      const button = screen.getByTestId('withdraw-button')
      expect(button).toBeInTheDocument()
    })

    test('should show correct text in the button', () => {
      const button = screen.getByTestId('withdraw-button')
      expect(button.textContent).toBe('Withdraw')

      rerenderFn({}, () => {
        mockHooksOrMethods.useRemoveLiquidity(() => {
          return {
            ...testData.removeLiquidity,
            allowance: convertToUnits('1000').toString(),
            withdrawing: true
          }
        })
      })
      const podInput = screen.getByTestId('pod-input')
      fireEvent.change(podInput, { target: { value: '1000' } })

      const button1 = screen.getByTestId('withdraw-button')
      expect(button1.textContent).toBe('Withdrawing...')
    })

    test('should disable the button when withdrawing', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useRemoveLiquidity(() => {
          return {
            ...testData.removeLiquidity,
            allowance: convertToUnits('1000').toString(),
            withdrawing: true
          }
        })
      })
      const podInput = screen.getByTestId('pod-input')
      fireEvent.change(podInput, { target: { value: '1000' } })

      const button = screen.getByTestId('withdraw-button')
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('Max buttons', () => {
    test('should fire max handlers', () => {
      const buttons = screen.getAllByRole('button')
      const npmBtn = buttons[0]
      const podBtn = buttons[3]

      expect(npmBtn).toHaveTextContent('Max')
      fireEvent.click(npmBtn)
      expect(podBtn).toHaveTextContent('Max')
      fireEvent.click(podBtn)
    })
  })
})
