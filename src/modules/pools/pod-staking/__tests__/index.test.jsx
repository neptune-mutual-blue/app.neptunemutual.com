import { screen, fireEvent } from '@/utils/unit-tests/test-utils'

import { PodStakingPage } from '@/modules/pools/pod-staking'
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'

const initialMocks = () => {
  mockFn.useNetwork()
  mockFn.usePodStakingPools()
  mockFn.usePoolInfo()
}

describe('PodStaking Page test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    PodStakingPage,
    {},
    initialMocks
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the main container', () => {
    const card = screen.getByTestId('pod-staking-page-container')
    expect(card).toBeInTheDocument()
  })

  test('should correctly render the SearchAndSortBar component', () => {
    const searchAndSortBar = screen.getByTestId('search-and-sort-container')
    expect(searchAndSortBar).toBeInTheDocument()
  })

  describe('Content', () => {
    test('should correctly render the Content component', () => {
      const content = screen.getByTestId('pools-grid')
      expect(content).toBeInTheDocument()
    })

    test('should render correct number of pod staking cards', () => {
      const cards = screen.getAllByTestId('pod-staking-card')
      expect(cards).toHaveLength(testData.podStakingPools.data.pools.length)
    })

    test('should render the show more button if not loading and has more', () => {
      rerenderFn({}, () => {
        mockFn.usePodStakingPools(() => ({
          ...testData.podStakingPools,
          hasMore: true
        }))
      })

      const btn = screen.getByTestId('show-more-button')
      expect(btn).toBeInTheDocument()
    })

    test('should show the loading grid when loading', () => {
      rerenderFn({}, () => {
        mockFn.usePodStakingPools(() => ({
          ...testData.podStakingPools,
          data: { pools: [] },
          loading: true
        }))
      })

      const grid = screen.getByTestId('loading-grid')
      expect(grid).toBeInTheDocument()
    })

    test('should render the no pools container if not loading & pool data is empty', () => {
      rerenderFn({}, () => {
        mockFn.usePodStakingPools(() => ({
          ...testData.podStakingPools,
          data: { pools: [] }
        }))
      })

      const grid = screen.getByTestId('no-pools-container')
      expect(grid).toBeInTheDocument()

      const noDataImage = screen.getByAltText('no data found')
      expect(noDataImage).toBeInTheDocument()
    })

    test('simulating clicking show more button', () => {
      rerenderFn({}, () => {
        mockFn.usePodStakingPools(() => ({
          ...testData.podStakingPools,
          hasMore: true
        }))
      })

      const btn = screen.getByTestId('show-more-button')
      fireEvent.click(btn)
      expect(testData.podStakingPools.handleShowMore).toHaveBeenCalled()
    })
  })
})
