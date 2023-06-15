import { PolicyCardFooter } from '@/modules/my-policies/PolicyCardFooter'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@/utils/unit-tests/test-utils'

const props = {
  coverKey:
    '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
  productKey:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  isDiversified: false,
  cxToken: {
    id: '0x0fdc3e2afd39a4370f5d493d5d2576b8ab3c5258',
    creationDate: '1658995606',
    expiryDate: '1667260799'
  },
  isClaimable: true,
  withinClaimPeriod: false,
  claimBeginsFrom: '1659004882',
  claimExpiresAt: '1659006682',
  incidentDate: '1658995751',
  beforeResolutionDeadline: true,
  amountToCover: '1000000000000000000000',
  isPolicyExpired: false
}
describe('PolicyCardFooter test', () => {
  const { initialRender, rerenderFn } = initiateTest(PolicyCardFooter, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render policy card footer', () => {
    const footer = screen.getByTestId('policy-card-footer')
    expect(footer).toBeInTheDocument()
  })

  test('should render the purchase policy stats', () => {
    const footer = screen.getByText('Purchased Policy')
    expect(footer).toBeInTheDocument()
  })

  test('should not render the claim link if not within claim period', () => {
    const footer = screen.queryByTestId('claim-link')
    expect(footer).not.toBeInTheDocument()
  })

  test('should render the claim link if within claim period', () => {
    rerenderFn({
      ...props,
      withinClaimPeriod: true
    })

    const link = screen.queryByTestId('claim-link')
    expect(link).toBeInTheDocument()
  })

  test('should render correct claim link', () => {
    rerenderFn({
      ...props,
      withinClaimPeriod: true,
      claimExpiresAt: new Date().getTime() / 1000 + 10000
    })

    const linkComponent = screen.getByTestId('claim-link')
    const link = `/my-policies/${safeParseBytes32String(
      props.coverKey
    )}/incidents/${props.incidentDate}/claim`
    expect(linkComponent).toHaveAttribute('href', link)
  })

  test('should have `CLAIM` text in claim link', () => {
    rerenderFn({
      ...props,
      withinClaimPeriod: true,
      claimExpiresAt: new Date().getTime() / 1000 + 10000
    })

    const link = screen.getByTestId('claim-link')
    expect(link).toHaveTextContent('Claim')
  })
})
