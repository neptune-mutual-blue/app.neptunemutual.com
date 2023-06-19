import { fireEvent, screen } from '@/utils/unit-tests/test-utils'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { ProvideLiquidityForm } from '@/common/LiquidityForms/ProvideLiquidityForm'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { convertFromUnits } from '@/utils/bn'

describe('PurchasePolicyForm component', () => {
  const { initialRender, rerenderFn } = initiateTest(
    ProvideLiquidityForm,
    {
      coverKey: testData.coverInfo.coverKey,
      info: testData.liquidityFormsContext.info,
      isDiversified: false
    },
    () => {
      mockHooksOrMethods.useRouter()
      mockHooksOrMethods.useAppConstants()
      mockHooksOrMethods.useProvideLiquidity()
      mockHooksOrMethods.useLiquidityFormsContext()
      mockHooksOrMethods.useCalculatePods()
      mockHooksOrMethods.useCoverActiveReportings()
    }
  )
  beforeEach(() => {
    initialRender()
  })

  test('should render liquidity form', () => {
    const form = screen.getByTestId('add-liquidity-form')
    expect(form).toBeInTheDocument()
  })

  test('should fire router.back on clicking back button', () => {
    const button = screen.getAllByRole('button')
    fireEvent.click(button[button.length - 1])
  })

  test("should render 'Calculating tokens' message on receiveAmountLoading", () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCalculatePods({ ...testData.calculatePods, loading: true })
    })

    const loadingText = screen.getByText(/Calculating tokens/i)
    expect(loadingText).toBeInTheDocument()
  })

  test("should render 'Fetching balances' message on npm balance loading", () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useProvideLiquidity({
        ...testData.provideLiquidity,
        npmBalanceLoading: true
      })
    })

    const loadingText = screen.getByText(/Fetching balance/i)
    expect(loadingText).toBeInTheDocument()
  })

  test("should render 'Fetching NPM allowance' message on npm allowance loading", () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useProvideLiquidity({
        ...testData.provideLiquidity,
        npmAllowanceLoading: true
      })
    })

    const loadingText = screen.getByText(/Fetching NPM allowance/i)
    expect(loadingText).toBeInTheDocument()
  })

  test("should render 'Fetching liquiditySymbol allowance' message on lq allowance loading", () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useProvideLiquidity({
        ...testData.provideLiquidity,
        lqAllowanceLoading: true
      })
    })

    const loadingText = screen.getByText(/Fetching DAI allowance/i)
    expect(loadingText).toBeInTheDocument()
  })

  test('should show alert if one of the product status is not normal', () => {
    rerenderFn({ isDiversified: true }, () => {
      mockHooksOrMethods.useCoverActiveReportings({
        data: [
          {
            id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x6b79626572000000000000000000000000000000000000000000000000000000-1662689043',
            status: 'FalseReporting',
            productKey:
              '0x6b79626572000000000000000000000000000000000000000000000000000000',
            incidentDate: '1662689043'
          }
        ]
      })
    })
    expect(screen.getByText(/as one of the product/i)).toBeInTheDocument()
  })

  test('should have max value on clicking handle max', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useProvideLiquidity()
      mockHooksOrMethods.useLiquidityFormsContext()
    })

    const buttons = screen.getAllByRole('button')
    const firstMaxBtn = buttons[0]

    fireEvent.click(firstMaxBtn)
    expect(screen.getAllByRole('textbox')[0]).toHaveValue(
      convertFromUnits(testData.provideLiquidity.npmBalance).toString()
    )

    const secondMaxBtn = buttons[3]
    fireEvent.click(secondMaxBtn)

    expect(screen.getAllByRole('textbox')[1]).toHaveValue(
      convertFromUnits(
        testData.liquidityFormsContext.stablecoinTokenBalance,
        testData.appConstants.liquidityTokenDecimals
      ).toString()
    )
  })

  test('should fire change handlers on input change', () => {
    const inputs = screen.getAllByRole('textbox')
    const npmInput = inputs[0]
    const lqInput = inputs[1]

    fireEvent.change(npmInput, { target: '1000' })
    fireEvent.change(lqInput, { target: '1000' })
  })

  test('should didplay correct error messages', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useProvideLiquidity()
      mockHooksOrMethods.useLiquidityFormsContext()
    })

    const inputs = screen.getAllByRole('textbox')
    const npmInput = inputs[0]
    const lqInput = inputs[1]

    fireEvent.change(npmInput, { target: { value: '100000' } })
    fireEvent.change(lqInput, { target: { value: '5' } })

    expect(screen.getByText(/Exceeds maximum balance/i)).toBeInTheDocument()
    expect(screen.getByText(/Liquidity is below threshold/i)).toBeInTheDocument()
  })
})
