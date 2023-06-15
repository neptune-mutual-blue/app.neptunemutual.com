import {
  MyLiquidityCoverCard
} from '@/common/Cover/MyLiquidity/MyLiquidityCoverCard'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@/utils/unit-tests/test-utils'

const data = testData.coversAndProducts2.data

describe('MyLiqudityCoverCard component', () => {
  beforeEach(() => {
    mockHooksOrMethods.useMyLiquidityInfo()

    const { initialRender } = initiateTest(MyLiquidityCoverCard, {
      coverKey: testData.coverInfo.coverKey,
      totalPODs: '500',
      tokenSymbol: 'POD',
      tokenDecimal: '16',
      coverData: data
    })

    initialRender()
  })

  test('should render the card productInfo is not null', () => {
    const wrapper = screen.getByTestId('title')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveTextContent(data.coverInfoDetails.coverName)
  })
})

describe('MyLiqudityCoverCard component', () => {
  beforeEach(() => {
    mockHooksOrMethods.useMyLiquidityInfo()

    const { initialRender } = initiateTest(MyLiquidityCoverCard, {
      coverKey: testData.coverInfo.coverKey,
      totalPODs: '500',
      tokenSymbol: 'POD',
      tokenDecimal: '16',
      subProducts: [data.productInfoDetails],
      coverData: { ...data, supportsProducts: true }
    })

    initialRender()
  })

  test('should render the card skeleton if productInfo is null', () => {
    const wrapper = screen.getByTestId('card-badge')
    expect(wrapper).toBeInTheDocument()
    const cardSkeletons = screen.getAllByTestId('card-outline').length
    expect(cardSkeletons).toBe(1)
  })
})
