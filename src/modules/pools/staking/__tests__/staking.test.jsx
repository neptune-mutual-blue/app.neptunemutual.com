import ReactDOM from 'react-dom'

import { act } from 'react-dom/test-utils'

import { StakingPage } from '@/modules/pools/staking'
import {
  getGraphURL,
  getNetworkId
} from '@/src/config/environment'
import { mockFetch } from '@/utils/unit-tests/mockApiRequest'
import {
  fireEvent,
  waitFor,
  withDataProviders,
  withSorting
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import * as web3Core from '@web3-react/core'

describe('Pool Staking', () => {
  global.fetch = jest.fn(mockFetch)

  jest.spyOn({ getNetworkId }, 'getNetworkId').mockImplementation(() => 80001)
  jest
    .spyOn({ getGraphURL }, 'getGraphURL')
    .mockImplementation(
      () =>
        'https://api.thegraph.com/subgraphs/name/neptune-mutual/subgraph-mumbai'
    )

  jest.spyOn(web3Core, 'useWeb3React').mockImplementation(() => ({
    activate: jest.fn(async () => {}),
    deactivate: jest.fn(async () => {}),
    active: true,
    setError: jest.fn(async () => {}),
    library: undefined,
    account: '0xaC43b98FE7352897Cbc1551cdFDE231a1180CD9e'
  }))

  const Component = withDataProviders(withSorting(StakingPage))
  const container = document.createElement('div')

  beforeAll(async () => {
    act(() => {
      i18n.activate('en')
      ReactDOM.render(<Component />, container)
    })
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(10))
  })

  describe('Staking card', () => {
    test('Card should be 6', () => {
      const stakeCards = select(container, SELECTION.TITLE)

      expect(stakeCards.length).toEqual(6)
    })

    describe('TVL', () => {
      test('should be 6', () => {
        const tvlElements = select(container, SELECTION.TVL)
        expect(tvlElements.length).toEqual(6)
      })

      test('no 0 value', () => {
        const tvlValues = getValues(container, SELECTION.TVL)

        const zeroValues = tvlValues.filter((value) => value === 0)

        expect(zeroValues.length).toEqual(0)
      })
    })

    describe('APR', () => {
      test('should be 6', () => {
        const aprElements = select(container, SELECTION.APR)
        expect(aprElements.length).toEqual(6)
      })

      test('no 0 value', () => {
        const aprValues = getValues(container, SELECTION.APR)
        const zeroValues = aprValues.filter((value) => value === 0)

        expect(zeroValues.length).toEqual(0)
      })
    })

    describe('Sorting', () => {
      test('Sorting is visible', () => {
        const sortButton = container.querySelector('button')

        act(() => {
          fireEvent.click(sortButton)
        })

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        )

        expect(container).toContainElement(sortList)
      })

      test('Sort Alphabetically', () => {
        const original = getValues(container, SELECTION.TITLE)

        const sortButton = container.querySelector('button')

        act(() => {
          fireEvent.select(sortButton)
        })

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        )

        const [alphabet] = Array.from(sortList.querySelectorAll('li'))

        act(() => {
          fireEvent.click(alphabet)
        })

        const values = getValues(container, SELECTION.TITLE)

        expect(original).toEqual(values)
      })

      test('Sort by TVL', () => {
        const original = getValues(container, SELECTION.TVL)

        const sortButton = container.querySelector('button')

        act(() => {
          fireEvent.click(sortButton)
        })

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        )

        const targetTvl = Array.from(sortList.querySelectorAll('li'))?.[1]

        act(() => {
          fireEvent.click(targetTvl)
        })

        const values = getValues(container, SELECTION.TVL)
        const sortedOriginal = [...original].sort(sortFromHighest)

        expect(original).not.toEqual(values)
        expect(sortedOriginal).toEqual(values)
      })

      test('Sort by APR', () => {
        const original = getValues(container, SELECTION.APR)

        const sortButton = container.querySelector('button')

        act(() => {
          fireEvent.click(sortButton)
        })

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        )

        const target = Array.from(sortList.querySelectorAll('li'))?.[2]

        act(() => {
          fireEvent.click(target)
        })

        const values = getValues(container, SELECTION.APR)
        const sortedOriginal = [...original].sort(sortFromHighest)

        expect(original).not.toEqual(values)
        expect(sortedOriginal).toEqual(values)
      })
    })
  })
})

const SELECTION = {
  TITLE: 'title',
  TVL: 'tvl',
  APR: 'apr'
}

const select = (container, type) => {
  if (type === SELECTION.TITLE) {
    return Array.from(container.querySelectorAll('h4'))
  }

  if (type === SELECTION.TVL) {
    return Array.from(
      container.querySelectorAll('.text-right[title] p.text-7398C0')
    )
  }

  return Array.from(container.querySelectorAll('.text-21AD8C'))
}

const getValues = (container, type) => {
  if (type === SELECTION.TITLE) {
    return select(container, type).map((el) => el.textContent)
  }

  if (type === SELECTION.TVL) {
    return select(container, type).map((el) =>
      parseFloat(el.textContent.slice(1))
    )
  }

  return select(container, type).map((el) =>
    parseFloat(el.textContent.slice('APR: '.length))
  )
}

const sortFromHighest = (a, b) => {
  if (a === b) {
    return 0
  }

  return a > b ? -1 : 1
}
