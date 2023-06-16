import { PurchasePolicyForm } from '@/common/CoverForm/PurchasePolicyForm'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'

const data = testData.coversAndProducts2.data

describe('PurchasePolicyForm component', () => {
  const { initialRender, rerenderFn } = initiateTest(
    PurchasePolicyForm,
    {
      coverKey: data.coverInfoDetails.coverKey,
      productKey: data.productInfoDetails.productKey,
      availableForUnderwriting: data.availableForUnderwriting,
      projectOrProductName: data.productInfoDetails.productName,
      coverageLag: data.coverageLag,
      parameters: data.productInfoDetails.parameters,
      isUserWhitelisted: data.isUserWhitelisted,
      requiresWhitelist: data.requiresWhitelist,
      activeIncidentDate: data.activeIncidentDate,
      productStatus: 0
    },
    () => {
      mockHooksOrMethods.useRouter()
      mockHooksOrMethods.useAppConstants()
      mockHooksOrMethods.usePolicyFees()
      mockHooksOrMethods.usePurchasePolicy()
      mockHooksOrMethods.useValidateReferralCode()
      mockHooksOrMethods.useWeb3React()
    }
  )
  beforeEach(() => {
    initialRender()
    jest.useFakeTimers().setSystemTime(new Date('2022-08-26'))
  })

  test('should render the purchase policy form', () => {
    rerenderFn({
      productStatus: 'Claimable'
    })

    const wrapper = screen.getByTestId('purchase-policy-form')
    expect(wrapper).toBeInTheDocument()
  })

  test('should fire on change when changing redderral code', async () => {
    const stepsButton = screen.getByTestId('form-steps-button')
    const input = screen.getByTestId('input-field')

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(stepsButton)

    const radio = screen.getByTestId('period-1')
    fireEvent.click(radio)

    const referralInput = screen.getByTestId('referral-input')
    fireEvent.change(referralInput) // changing referral code input
  })

  test("should show 'Fetching...' if fees is loading", () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.usePolicyFees({ ...testData.policyFees, loading: true })
    })

    const stepsButton = screen.getByTestId('form-steps-button')
    const input = screen.getByTestId('input-field')

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(stepsButton)

    const radio = screen.getByTestId('period-1')
    fireEvent.click(radio)
    fireEvent.click(stepsButton)

    const rulesCheckbox = screen.getByTestId('accept-rules')
    fireEvent.click(rulesCheckbox)

    fireEvent.click(stepsButton)

    const loadingMsg = screen.getAllByText('Fetching fees...')
    expect(loadingMsg.length).toBeTruthy()
  })

  test("should show 'Fetching Allowance...' if allowance is updating", () => {
    // as mock fn is already returning updating allowance as true
    const stepsButton = screen.getByTestId('form-steps-button')
    const input = screen.getByTestId('input-field')

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(stepsButton)

    const radio = screen.getByTestId('period-1')
    fireEvent.click(radio)
    fireEvent.click(stepsButton)

    const rulesCheckbox = screen.getByTestId('accept-rules')
    fireEvent.click(rulesCheckbox)

    fireEvent.click(stepsButton)

    const loadingMsg = screen.getByText(/Fetching Allowance.../i)
    expect(loadingMsg).toBeInTheDocument()
  })

  test("should show 'Fetching Balance...' if balance is updating", () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.usePurchasePolicy({
        ...testData.purchasePolicy,
        updatingAllowance: false,
        updatingBalance: true
      })
    })

    const stepsButton = screen.getByTestId('form-steps-button')
    const input = screen.getByTestId('input-field')

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(stepsButton)

    const radio = screen.getByTestId('period-1')
    fireEvent.click(radio)
    fireEvent.click(stepsButton)

    const rulesCheckbox = screen.getByTestId('accept-rules')
    fireEvent.click(rulesCheckbox)

    fireEvent.click(stepsButton)

    const loadingMsg = screen.getByText(/Fetching balance.../i)
    expect(loadingMsg).toBeInTheDocument()
  })

  test('should show alert if user is not whielisted and cover requires whitelist', () => {
    rerenderFn({
      requiresWhitelist: true,
      isUserWhitelisted: false
    })

    const message = screen.getByText(/You are not whitelisted/i)
    expect(message).toBeInTheDocument()
  })

  test('should fire radio button handler on change', () => {
    const stepsButton = screen.getByTestId('form-steps-button')
    const input = screen.getByTestId('input-field')

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(stepsButton)

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
      mockHooksOrMethods.useValidateReferralCode({
        ...testData.referralCodeHook,
        isValid: false
      })
    })

    const stepsButton = screen.getByTestId('form-steps-button')
    const input = screen.getByTestId('input-field')

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(stepsButton)

    const radio = screen.getByTestId('period-1')
    fireEvent.click(radio)

    const referralInput = screen.getByTestId('referral-input')
    fireEvent.change(referralInput, { target: { value: 'sadjasdklads' } })
  })

  test('should show loader', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useValidateReferralCode({
        ...testData.referralCodeHook,
        isPending: true,
        isValid: false,
        errorMessage: ''
      })
    })

    const stepsButton = screen.getByTestId('form-steps-button')
    const input = screen.getByTestId('input-field')

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(stepsButton)

    const radio = screen.getByTestId('period-1')
    fireEvent.click(radio)

    const referralInput = screen.getByTestId('referral-input')
    fireEvent.change(referralInput, { target: { value: 'sadjasdklads' } })

    const loading = screen.getByTestId('loader')
    expect(loading).toBeInTheDocument()
  })

  test('should fire router.back on clicking back', () => {
    const backBtn = screen.getAllByRole('button')

    fireEvent.click(backBtn[backBtn.length - 1])
  })

  test('should fire handlePurchase', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.usePurchasePolicy({
        ...testData.purchasePolicy,
        approving: false,
        canPurchase: true,
        purchasing: false,
        handlePurchase: jest.fn()
      })
    })

    const stepsButton = screen.getByTestId('form-steps-button')
    const input = screen.getByTestId('input-field')

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(stepsButton)

    const radio = screen.getByTestId('period-1')
    fireEvent.click(radio)
    fireEvent.click(stepsButton)

    const rulesCheckbox = screen.getByTestId('accept-rules')
    fireEvent.click(rulesCheckbox)

    expect(stepsButton).toHaveTextContent('Purchase Policy')
    expect(fireEvent.click(stepsButton)).toBeTruthy()
  })
})
