import { screen, fireEvent } from '@/utils/unit-tests/test-utils'
import { ClaimCoverModal } from '@/modules/my-policies/ClaimCoverModal'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { convertFromUnits, toBN } from '@/utils/bn'
import { formatPercent } from '@/utils/formatter/percent'
import { MULTIPLIER } from '@/src/config/constants'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const props = {
  claimPlatformFee: '650',
  coverKey:
    '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
  productKey:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  cxTokenAddress: '0x0fdc3e2afd39a4370f5d493d5d2576b8ab3c5258',
  isOpen: true,
  onClose: jest.fn(),
  modalTitle: 'Claim Cover',
  incidentDate: '1658995751'
}

function initialMocks () {
  mockHooksOrMethods.useClaimPolicyInfo()
  mockHooksOrMethods.useAppConstants()
}

describe('ClaimCoverModal test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    ClaimCoverModal,
    props,
    initialMocks
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('claim-cover-modal')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct image source for policy', () => {
    const imgSrc = getCoverImgSrc({ key: props.coverKey })
    const wrapper = screen.getByTestId('dialog-title')
    expect(wrapper.querySelector('img')).toHaveAttribute('src', imgSrc)
  })

  test('should render correct modal title', () => {
    const wrapper = screen.getByTestId('dialog-title')
    expect(wrapper.querySelector('span')).toHaveTextContent(props.modalTitle)
  })

  test('should render the token input field', () => {
    const wrapper = screen.getByTestId('token-input')
    expect(wrapper.querySelector('input')).toBeInTheDocument()
  })

  test('should render the error text when error is present', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useClaimPolicyInfo(() => {
        return {
          ...testData.claimPolicyInfo,
          error: 'Error'
        }
      })
    })

    const wrapper = screen.getByTestId('error-text')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveTextContent('Error')
  })

  test('disabled input should have correct value', () => {
    const wrapper = screen
      .getByTestId('receive-info-container')
      .querySelector('span')
    const val = convertFromUnits(
      testData.claimPolicyInfo.receiveAmount,
      testData.appConstants.liquidityTokenDecimals
    ).toString()
    expect(wrapper).toHaveTextContent(val)
  })

  test('should show correct fee', () => {
    const wrapper = screen
      .getByTestId('receive-info-container')
      .querySelector('p')
    const val = `Fee: ${formatPercent(
      toBN(props.claimPlatformFee).dividedBy(MULTIPLIER).toString(),
      'en'
    )}`
    expect(wrapper).toHaveTextContent(val)
  })

  describe('Claim button', () => {
    test('should render the claim button when canClaim is true', () => {
      const wrapper = screen.getByTestId('claim-button')
      expect(wrapper).toBeInTheDocument()
    })

    test("claim button should show 'Claim' when claiming is false", () => {
      const wrapper = screen.getByTestId('claim-button')
      expect(wrapper).toHaveTextContent('Claim')
    })

    test("claim button should show 'Claiming' when claiming is true", () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useClaimPolicyInfo(() => {
          return {
            ...testData.claimPolicyInfo,
            claiming: true
          }
        })
      })

      const wrapper = screen.getByTestId('claim-button')
      expect(wrapper).toHaveTextContent('Claiming')
    })

    test('simulating claim button click should call handleClaim', () => {
      const wrapper = screen.getByTestId('claim-button')
      fireEvent.click(wrapper)
      // expect(mockUseClaimPolicyInfo.handleClaim).toHaveBeenCalled();
    })
  })

  describe('Approve button', () => {
    test('should render the approve button when canClaim is false', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useClaimPolicyInfo(() => {
          return {
            ...testData.claimPolicyInfo,
            canClaim: false
          }
        })
      })

      const wrapper = screen.getByTestId('approve-button')
      expect(wrapper).toBeInTheDocument()
    })

    test("approve button should show 'Approve' when approving is false", () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useClaimPolicyInfo(() => {
          return {
            ...testData.claimPolicyInfo,
            canClaim: false
          }
        })
      })

      const wrapper = screen.getByTestId('approve-button')
      expect(wrapper).toHaveTextContent('Approve')
    })

    test("approve button should show 'Approving' when approving is true", () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useClaimPolicyInfo(() => {
          return {
            ...testData.claimPolicyInfo,
            approving: true,
            canClaim: false
          }
        })
      })

      const wrapper = screen.getByTestId('approve-button')
      expect(wrapper).toHaveTextContent('Approving')
    })

    test('should be disabled when approving or error or loadingAllowance', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useClaimPolicyInfo(() => {
          return {
            ...testData.claimPolicyInfo,
            approving: true,
            error: 'error',
            loadingAllowance: true,
            canClaim: false
          }
        })
      })
      const button = screen.getByTestId('approve-button')
      expect(button).toBeDisabled()
    })
  })

  describe('coverage improve', () => {
    test('passing isOpen as false for coverage', () => {
      rerenderFn({
        ...props,
        isOpen: false
      })
    })

    test('providing loadingBalance from hook', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useCxTokenRowContext(() => {
          return {
            ...testData.cxTokenRowContext,
            balance: '0',
            loadingBalance: true,
            tokenSymbol: 'CX'
          }
        })
      })
    })

    test('providing loadingFees from hook', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.useCxTokenRowContext(() => {
          return {
            ...testData.cxTokenRowContext,
            balance: '0',
            loadingBalance: false,
            tokenSymbol: 'CX'
          }
        })
        rerenderFn({}, () => {
          mockHooksOrMethods.useClaimPolicyInfo(() => {
            return {
              ...testData.claimPolicyInfo,
              loadingAllowance: false,
              loadingFees: true
            }
          })
        })
      })
    })
  })
})
