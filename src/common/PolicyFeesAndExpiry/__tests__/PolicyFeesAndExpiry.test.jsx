import {
  PolicyFeesAndExpiry
} from '@/common/PolicyFeesAndExpiry/PolicyFeesAndExpiry'
import { MULTIPLIER } from '@/src/config/constants'
import { toBN } from '@/utils/bn'
import { formatPercent } from '@/utils/formatter/percent'
import {
  act,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('PolicyFeesAndExpiry component behaviour', () => {
  const mockdata = {
    fee: '39490958',
    rate: '1486',
    expiryDate: '1667260799'
  }

  const rateConverted = toBN(mockdata.rate).dividedBy(MULTIPLIER).toString()

  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render fees percent', () => {
    render(<PolicyFeesAndExpiry data={mockdata} />)
    const feesPercent = screen.getByText(formatPercent(rateConverted, 'en'))
    expect(feesPercent).toBeInTheDocument()
  })
})
