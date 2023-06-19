import { PodStakingCard } from '@/modules/pools/pod-staking/PodStakingCard'
import { getTokenImgSrc } from '@/src/helpers/token'
import { getApr } from '@/src/services/protocol/staking-pool/info/apr'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'

const props = {
  data: {
    id: '0x6262382d65786368616e67650000000000000000000000000000000000000000',
    key: '0x6262382d65786368616e67650000000000000000000000000000000000000000',
    name: 'Earn BEC',
    poolType: 'PODStaking',
    stakingToken: '0x148ec3a5d403c4de2efb3995e7ab95139337dae8',
    stakingTokenName: 'bb8-exchange-ndai',
    stakingTokenSymbol: 'nDAI',
    uniStakingTokenDollarPair: '0x0000000000000000000000000000000000000000',
    rewardToken: '0xc6aa2672f65617296ce65b67dc035f65adfe0701',
    rewardTokenName: 'Fake Bb8 Exchange',
    rewardTokenSymbol: 'BEC',
    uniRewardTokenDollarPair: '0xbf97bbba44b5d0225179757f0eb33a52297f3828',
    rewardTokenDeposit: '18000000000000000000000000',
    maxStake: '20000000000000000000000',
    rewardPerBlock: '4566764500',
    lockupPeriodInBlocks: '1200',
    platformFee: '25',
    tvl: '36023415510680653787764225',
    apr: '0.09613510806640226068125255226151082117235838421205184343029845835434840473688674'
  },
  tvl: '36023415510680653787764225',
  getPriceByAddress: jest.fn((e) => {
    if (e === testData.poolInfo.info.stakingToken) { return '1.00028' } else if (e === testData.poolInfo.info.rewardToken) { return '1' }
  })
}
const initialMocks = () => {
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useSortableStats()
  mockHooksOrMethods.usePoolInfo()
}

describe('PodStakingCard test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    PodStakingCard,
    props,
    initialMocks
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the wrapper container', () => {
    const card = screen.getByTestId('pod-staking-card')
    expect(card).toBeInTheDocument()
  })

  test('should have correct image', () => {
    const altText = props.data.rewardTokenSymbol
    const img = screen.getByAltText(altText)
    expect(img).toBeInTheDocument()
  })

  test('image should have correct src', () => {
    const altText = props.data.rewardTokenSymbol
    const src = getTokenImgSrc(props.data.rewardTokenSymbol)
    const img = screen.getByAltText(altText)
    expect(img).toHaveAttribute('src', src)
  })

  test('should have correct card title', () => {
    const title = testData.poolInfo.info.name
    const cardTitle = screen.getByText(title)
    expect(cardTitle).toBeInTheDocument()
  })

  test('should have correct card subtitle', () => {
    const subtitle = `Stake ${props.data.stakingTokenName}`
    const cardSubtitle = screen.getByText(subtitle)
    expect(cardSubtitle).toBeInTheDocument()
  })

  test('should  display correct badge text', () => {
    // data
    const apr = getApr(testData.network.networkId, {
      stakingTokenPrice: props.getPriceByAddress(
        testData.poolInfo.info.stakingToken
      ),
      rewardPerBlock: testData.poolInfo.info.rewardPerBlock,
      rewardTokenPrice: props.getPriceByAddress(
        testData.poolInfo.info.rewardToken
      )
    })
    const badgeText = `APR: ${formatPercent(apr, 'en')}`

    const badge = screen.getByText(badgeText)
    expect(badge).toBeInTheDocument()
  })

  test('should render correct number of card stats', () => {
    const cardStats = screen.getAllByTestId('pod-staking-card-stat')
    expect(cardStats).toHaveLength(2)
  })

  test('should not render Pool stat cards & staking cards when stake is 0', () => {
    const poolStatCard = screen.queryByTestId('pool-card-stat')
    const stakingCards = screen.queryAllByTestId('staking-cards')
    expect(poolStatCard).not.toBeInTheDocument()
    expect(stakingCards).toHaveLength(0)
  })

  test('should render Pool stat cards & staking cards when stake is greater than 0', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.usePoolInfo(() => {
        return {
          ...testData.poolInfo,
          info: {
            ...testData.poolInfo.info,
            myStake: '1000000000000000000'
          }
        }
      })
    })

    screen.debug()

    // const poolStatCard = screen.queryByTestId('pool-card-stat')
    const stakingCards = screen.queryAllByTestId('staking-cards')
    // expect(poolStatCard).toBeInTheDocument()
    expect(stakingCards.length).toBeGreaterThanOrEqual(1)
  })

  test('should have correct value in pool stat card', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.usePoolInfo(() => {
        return {
          ...testData.poolInfo,
          info: {
            ...testData.poolInfo.info,
            myStake: '1000000000000000000'
          }
        }
      })
    })

    const poolStatValues = screen.getAllByTestId('stat-value')
    const poolStatValue = formatCurrency(
      convertFromUnits(testData.poolInfo.info.rewards),
      'en',
      props.data.rewardTokenSymbol,
      true
    ).short
    expect(poolStatValues[1]).toHaveTextContent(poolStatValue)
  })

  test('should render the stake button if stake is 0', () => {
    const stakeBtn = screen.getByText('Stake')
    expect(stakeBtn).toBeInTheDocument()
  })

  describe('modals', () => {
    beforeEach(() => {
      rerenderFn({}, () => {
        mockHooksOrMethods.usePoolInfo(() => {
          return {
            ...testData.poolInfo,
            info: {
              ...testData.poolInfo.info,
              myStake: '1000000000000000000'
            }
          }
        })
      })
    })

    test('should not render the stake modal by default', () => {
      const stakeModal = screen.queryByTestId('stake-modal')
      expect(stakeModal).not.toBeInTheDocument()
    })

    test('should render the stake modal when add button is clicked', () => {
      const addBtn = screen.getByTestId('add-btn')
      fireEvent.click(addBtn)

      const stakeModal = screen.queryByTestId('staking-modal')
      expect(stakeModal).toBeInTheDocument()
    })

    test('should not render the collect reward modal by default', () => {
      const rewardModal = screen.queryByTestId('collect-reward-modal')
      expect(rewardModal).not.toBeInTheDocument()
    })

    test('should render the collect reward modal when collect button is clicked', () => {
      const collectBtn = screen.getByTestId('collect-btn')
      fireEvent.click(collectBtn)

      const rewardModal = screen.queryByTestId('collect-reward-modal')
      expect(rewardModal).toBeInTheDocument()
    })
  })
})
