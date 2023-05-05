import {
  MyLiquidityCoverCard
} from '@/common/Cover/MyLiquidity/MyLiquidityCoverCard'
import { testData } from '@/utils/unit-tests/test-data'
import {
  initiateTest,
  mockFn
} from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@/utils/unit-tests/test-utils'

describe('MyLiqudityCoverCard component', () => {
  beforeEach(() => {
    mockFn.useMyLiquidityInfo()
    // mockFn.useCoverOrProductData()

    const { initialRender } = initiateTest(MyLiquidityCoverCard, {
      coverKey: testData.coverInfo.coverKey,
      totalPODs: '500',
      tokenSymbol: 'POD',
      tokenDecimal: '16'
    })

    initialRender()
  })

  test('should render the card productInfo is not null', () => {
    const wrapper = screen.getByTestId('title')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveTextContent(testData.coverInfo.infoObj.coverName)
  })
})

describe('MyLiqudityCoverCard component', () => {
  beforeEach(() => {
    mockFn.useMyLiquidityInfo()
    // mockFn.useCoverOrProductData(() => {})

    const { initialRender } = initiateTest(MyLiquidityCoverCard, {
      coverKey: testData.coverInfo.coverKey,
      totalPODs: '500',
      tokenSymbol: 'POD',
      tokenDecimal: '16'
    })

    initialRender()
  })

  test('should render the card skeleton if productInfo is null', () => {
    const wrapper = screen.getByTestId('card-status-badge')
    expect(wrapper).toBeInTheDocument()
    const cardSkeletons = screen.getAllByTestId('card-outline').length
    expect(cardSkeletons).toBe(1)
  })
})
