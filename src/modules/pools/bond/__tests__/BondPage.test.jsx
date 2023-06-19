import { waitFor, withProviders } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import {
  covers,
  pools,
  contracts,
  pricing,
  bondInfo
} from '@/utils/unit-tests/data/coverOptionsMockUpData'
import BondPage from '@/modules/pools/bond'
import { createMockRouter } from '@/utils/unit-tests/createMockRouter'
import { render } from '@testing-library/react'

const NETWORKID = 80001

const MOCKUP_API_URLS = {
  GET_CONTRACTS_URL: `${process.env.NEXT_PUBLIC_API_URL}/protocol/contracts/mumbai`,
  GET_PRICING_URL: `${process.env.NEXT_PUBLIC_API_URL}/pricing/${NETWORKID}`,
  SUB_GRAPH: process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
  GET_BOND_INFO: `${process.env.NEXT_PUBLIC_API_URL}/protocol/bond/info/80001/0x0000000000000000000000000000000000000001`
}

const QUERY = {
  POOLS: 'pools',
  COVERS: 'covers'
}

async function mockFetch (url, { body }) {
  if (url.startsWith(MOCKUP_API_URLS.GET_CONTRACTS_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => { return contracts }
    }
  }

  if (url.startsWith(MOCKUP_API_URLS.GET_PRICING_URL)) {
    return {
      ok: true,
      status: 200,
      json: async () => { return pricing }
    }
  }

  if (url.startsWith(MOCKUP_API_URLS.GET_BOND_INFO)) {
    return {
      ok: true,
      status: 200,
      json: async () => { return bondInfo }
    }
  }

  if (url.startsWith(MOCKUP_API_URLS.SUB_GRAPH)) {
    if (body.includes(QUERY.POOLS)) {
      return {
        ok: true,
        status: 200,
        json: async () => { return pools }
      }
    }

    if (body.includes(QUERY.COVERS)) {
      return {
        ok: true,
        status: 200,
        json: async () => { return covers }
      }
    }
  }

  throw new Error(`Unhandled request: ${url}`)
}

describe('BondPage', () => {
  global.fetch = jest.fn(mockFetch)

  beforeAll(async () => {
    i18n.activate('en')
  })

  test('has correct number cover actions', async () => {
    const router = createMockRouter({})
    const Component = withProviders(BondPage, router)
    const { getByTestId } = render(<Component />)

    const CoverOptionActions = await waitFor(() => { return getByTestId('bond-amount-input') }
    )

    expect(CoverOptionActions).toBeInTheDocument()
  })
})
