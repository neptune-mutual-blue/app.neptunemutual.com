import { PodStakingPage } from '@/modules/pools/pod-staking'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'

const initialMocks = () => {
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.usePodStakingPools()
  mockHooksOrMethods.usePoolInfo()
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
        mockHooksOrMethods.usePodStakingPools(() => {
          return {
            ...testData.podStakingPools,
            hasMore: true
          }
        })
      })

      const btn = screen.getByTestId('show-more-button')
      expect(btn).toBeInTheDocument()
    })

    test('should show the loading grid when loading', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.usePodStakingPools(() => {
          return {
            ...testData.podStakingPools,
            data: { pools: [] },
            loading: true
          }
        })
      })

      const grid = screen.getByTestId('loading-grid')
      expect(grid).toBeInTheDocument()
    })

    test('should render the no pools container if not loading & pool data is empty', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.usePodStakingPools(() => {
          return {
            ...testData.podStakingPools,
            data: { pools: [] }
          }
        })
      })

      const grid = screen.getByTestId('no-pools-container')
      expect(grid).toBeInTheDocument()

      const noDataImage = screen.getByAltText(/no data found/i)
      expect(noDataImage).toBeInTheDocument()
    })

    test('simulating clicking show more button', () => {
      rerenderFn({}, () => {
        mockHooksOrMethods.usePodStakingPools(() => {
          return {
            ...testData.podStakingPools,
            hasMore: true
          }
        })
      })

      const btn = screen.getByTestId('show-more-button')
      fireEvent.click(btn)
      expect(testData.podStakingPools.handleShowMore).toHaveBeenCalled()
    })
  })
})
