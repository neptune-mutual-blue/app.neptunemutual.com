import { i18n } from '@lingui/core'
import { fireEvent, screen } from '@/utils/unit-tests/test-utils'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { BondInfoCard } from '@/modules/pools/bond/BondInfoCard'

describe('BondInfoCard test', () => {
  const { initialRender, rerenderFn } = initiateTest(BondInfoCard, {
    account: testData.account.account,
    info: testData.bondInfo.info,
    details: testData.bondInfo.details,
    roi: testData.bondInfo.roi
  })

  beforeEach(() => {
    i18n.activate('en')
    initialRender()
  })

  test('should render Bond Price in the card', () => {
    const bondPrice = screen.getByText(/Bond Price/i)
    expect(bondPrice).toBeInTheDocument()
  })

  test('should render vesting term', () => {
    const text = screen.getByText(/10 mins/i)
    expect(text).toBeInTheDocument()
  })

  test('should show claim your bond modal after clicking claim button', () => {
    rerenderFn({
      account: testData.account.account,
      info: { ...testData.bondInfo.info, claimable: '10' },
      details: testData.bondInfo.details,
      roi: testData.bondInfo.roi
    })
    const button = screen.getAllByRole('button')
    expect(button[1]).toHaveTextContent('Claim My Bond')
    fireEvent.click(button[1])
    const modal = screen.getByText(/Claim Bond/i)
    expect(modal).toBeInTheDocument()

    const closeButton = screen.getByTestId('modal-close-button')
    fireEvent.click(closeButton)
  })
})
