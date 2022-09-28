import { fireEvent, screen } from '@/utils/unit-tests/test-utils'
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'
import { PurchasePolicyForm } from '@/common/CoverForm/PurchasePolicyForm'

describe('PurchasePolicyForm component', () => {
  const { initialRender, rerenderFn } = initiateTest(
    PurchasePolicyForm,
    {
      coverKey: testData.coverInfo.coverKey,
      productKey: ''
    },
    () => {
      mockFn.useRouter()
      mockFn.useAppConstants()
      mockFn.useCoverStatsContext()
      mockFn.usePolicyFees()
      mockFn.usePurchasePolicy()
      mockFn.useValidateReferralCode()
    }
  )
  beforeEach(() => {
    initialRender()
    jest.useFakeTimers().setSystemTime(new Date('2022-08-26'))
  })

  test('should render the purchase policy form', () => {
    const wrapper = screen.getByTestId('purchase-policy-form')
    expect(wrapper).toBeInTheDocument()
  })

  test('should fire on change when changing redderral code', () => {
    const input = screen.getByTestId('referral-input')
    expect(input).toBeInTheDocument()
    fireEvent.change(input, { target: { value: 'sadjasdklads' } })
    const errorCode = screen.getByText(testData.referralCodeHook.errorMessage)
    expect(errorCode).toBeInTheDocument()
  })

  test("should show 'Fetching...' if fees is loading", () => {
    rerenderFn({}, () => {
      mockFn.usePolicyFees({ ...testData.policyFees, loading: true })
    })

    const loadingMsg = screen.getByText(/Fetching.../i)
    expect(loadingMsg).toBeInTheDocument()
  })

  test("should show 'Fetching Allowance...' if allowance is updating", () => {
    // as mock fn is already returning updating allowance as true
    const loadingMsg = screen.getByText(/Fetching Allowance.../i)
    expect(loadingMsg).toBeInTheDocument()
  })

  test("should show 'Fetching Balance...' if balance is updating", () => {
    rerenderFn({}, () => {
      mockFn.usePurchasePolicy({
        ...testData.purchasePolicy,
        updatingAllowance: false,
        updatingBalance: true
      })
    })

    const loadingMsg = screen.getByText(/Fetching Balance.../i)
    expect(loadingMsg).toBeInTheDocument()
  })

  test('should show alert if user is not whielisted and cover requires whitelist', () => {
    rerenderFn({}, () => {
      mockFn.useCoverStatsContext({
        ...testData.coverStats.info,
        requiresWhitelist: true,
        isUserWhitelisted: false
      })
    })

    const message = screen.getByText(/You are not whitelisted/i)
    expect(message).toBeInTheDocument()
  })

  test('should show alert with product status anything other than normal', () => {
    rerenderFn({}, () => {
      mockFn.useCoverStatsContext({
        ...testData.coverStats.info,
        productStatus: 'Incident Occured'
      })
    })

    const message = screen.getByText(/Cannot purchase policy,/i)
    expect(message).toBeInTheDocument()

    const purchaseForm = screen.queryByTestId('purchase-policy-form')
    expect(purchaseForm).not.toBeInTheDocument()
  })

  test('should fire radio button handler on change', () => {
    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBe(3)

    fireEvent.click(radios[2])
  })

  test('should fire input handler on change', () => {
    const form = screen.getByTestId('purchase-policy-form')
    const input = form.getElementsByTagName('input')
    fireEvent.change(input[0], { target: { value: '100' } })
  })

  test('should show error message if referral code returs not valid', () => {
    rerenderFn({}, () => {
      mockFn.useValidateReferralCode({
        ...testData.referralCodeHook,
        isValid: false
      })
    })

    const input = screen.getByTestId('referral-input')
    fireEvent.change(input, { target: { value: 'sadjasdklads' } })

    const errorCode = screen.getByText(testData.referralCodeHook.errorMessage)
    expect(errorCode).toBeInTheDocument()
  })

  test('should show loader', () => {
    rerenderFn({}, () => {
      mockFn.useValidateReferralCode({
        ...testData.referralCodeHook,
        isPending: true,
        isValid: false,
        errorMessage: ''
      })
    })

    const input = screen.getByTestId('referral-input')
    fireEvent.change(input, { target: { value: 'sadjasdklads' } })

    const loading = screen.getByTestId('loader')
    expect(loading).toBeInTheDocument()
  })

  test('should fire router.back on clicking back', () => {
    const backBtn = screen.getAllByRole('button')

    fireEvent.click(backBtn[backBtn.length - 1])
  })

  test('should fire handlePurchase', () => {
    rerenderFn({}, () => {
      mockFn.usePurchasePolicy({
        ...testData.purchasePolicy,
        approving: false,
        canPurchase: true,
        purchasing: false,
        handlePurchase: jest.fn()
      })
    })

    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[2])

    const purchase = screen.getAllByRole('button')
    expect(purchase[purchase.length - 2]).toHaveTextContent('Purchase policy')
    fireEvent.click(purchase[purchase.length - 2])
  })
})
