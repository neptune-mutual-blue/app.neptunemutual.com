import { screen, fireEvent } from '@/utils/unit-tests/test-utils'
import * as Component from '@/modules/my-policies/ClaimCxTokensTable'
import { fromNow } from '@/utils/formatter/relative-time'
import DateLib from '@/lib/date/DateLib'
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const props = {
  activePolicies: [
    {
      id: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9-0x1e26d3104132c01ffb4bd219c2865a6436dc6ee1-1656633599',
      cxToken: {
        id: '0x1e26d3104132c01ffb4bd219c2865a6436dc6ee1',
        creationDate: '1654065199',
        expiryDate: '1656633599'
      },
      totalAmountToCover: '200000000000000000000',
      expiresOn: '1656633599',
      cover: {
        id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000'
      }
    },
    {
      id: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9-0x4a1801c51b1acb083cc198fc3022d08eac0b583d-1656633599',
      cxToken: {
        id: '0x4a1801c51b1acb083cc198fc3022d08eac0b583d',
        creationDate: '1653884896',
        expiryDate: '1656633599'
      },
      totalAmountToCover: '1400000000000000000000',
      expiresOn: '1656633599',
      cover: {
        id: '0x6262382d65786368616e67650000000000000000000000000000000000000000'
      }
    },
    {
      id: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9-0xa363182843ccd48ec068f88a2ec932fa04b5dd7c-1659311999',
      cxToken: {
        id: '0xa363182843ccd48ec068f88a2ec932fa04b5dd7c',
        creationDate: '1653825622',
        expiryDate: '1659311999'
      },
      totalAmountToCover: '500000000000000000000',
      expiresOn: '1659311999',
      cover: {
        id: '0x6372706f6f6c0000000000000000000000000000000000000000000000000000'
      }
    }
  ],
  coverKey:
    '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
  incidentDate: '1656633599',
  report: {
    claimExpiresAt: '1659311999'
  },
  setPage: jest.fn(),
  hasMore: false,
  loading: false
}

const initialMocks = () => {
  mockHooksOrMethods.useCxTokenRowContext()
  mockHooksOrMethods.useClaimTableContext()
}

describe('ClaimCxTokensTable test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    Component.ClaimCxTokensTable,
    props,
    initialMocks
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the outer table wrapper', () => {
    const wrapper = screen.getByTestId('table-wrapper')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the table header', () => {
    const wrapper = screen.getByTestId('table-header')
    expect(wrapper).toBeInTheDocument()
  })

  describe('Table Head', () => {
    test('should render correct number of th elements', () => {
      const ths = screen.getByTestId('table-header').querySelectorAll('th')
      expect(ths.length).toBe(Component.columns.length)
    })

    test('should render correct table header text', () => {
      const ths = screen.getByTestId('table-header').querySelectorAll('th')
      expect(ths[0].textContent).toBe(Component.columns[0].name)
      expect(ths[1].textContent).toBe(Component.columns[1].name)
      expect(ths[2].textContent).toBe(Component.columns[2].name)
    })
  })

  describe('No data', () => {
    test('should render "No data" message', () => {
      rerenderFn({ activePolicies: [] })
      const message = screen.getByText('No data found')
      expect(message).toBeInTheDocument()
    })

    test('should render `loading` when no data & loading is true', () => {
      rerenderFn({ activePolicies: [], loading: true })
      const loading = screen.getByText('loading...')
      expect(loading).toBeInTheDocument()
    })
  })

  test('should render correct number of table rows', () => {
    const tbody = screen.getByTestId('app-table-body')
    const trs = tbody.querySelectorAll('tr')
    expect(trs.length).toBe(props.activePolicies.length)
  })

  describe('Table Row Data', () => {
    test('should render correct address in row', () => {
      const tbody = screen.getByTestId('app-table-body')
      const tr = tbody.querySelectorAll('tr')[0]
      expect(tr.querySelectorAll('td')[0].textContent).toBe(
        props.activePolicies[0].cxToken.id
      )
    })

    test('should render correct claim date in row', () => {
      const tbody = screen.getByTestId('app-table-body')
      const tr = tbody.querySelectorAll('tr')[0]
      const textContent = tr
        .querySelectorAll('td')[1]
        .querySelector('span').textContent
      const claimDate = fromNow(
        testData.claimTableContext.report.claimExpiresAt || 0
      )
      expect(textContent).toBe(claimDate)
    })

    test('should render correct claim date span title', () => {
      const tbody = screen.getByTestId('app-table-body')
      const tr = tbody.querySelectorAll('tr')[0]
      const span = tr.querySelectorAll('td')[1].querySelector('span')
      const claimDate = DateLib.toLongDateFormat(
        testData.claimTableContext.report?.claimExpiresAt || 0,
        'en'
      )
      expect(span.title).toBe(claimDate)
    })

    test('should render correct claim amount in row', () => {
      const tbody = screen.getByTestId('app-table-body')
      const tr = tbody.querySelectorAll('tr')[0]
      const textContent = tr
        .querySelectorAll('td')[2]
        .querySelector('span').textContent
      const claimAmount = formatCurrency(
        convertFromUnits(testData.cxTokenRowContext.balance),
        'en',
        testData.cxTokenRowContext.tokenSymbol,
        true
      ).short
      expect(textContent).toBe(claimAmount)
    })

    test('should render correct claim amount span title', () => {
      const tbody = screen.getByTestId('app-table-body')
      const tr = tbody.querySelectorAll('tr')[0]
      const span = tr.querySelectorAll('td')[2].querySelector('span')
      const claimAmount = formatCurrency(
        convertFromUnits(testData.cxTokenRowContext.balance),
        'en',
        testData.cxTokenRowContext.tokenSymbol,
        true
      ).long
      expect(span.title).toBe(claimAmount)
    })

    test('should render the claim action button', () => {
      const tbody = screen.getByTestId('app-table-body')
      const tr = tbody.querySelectorAll('tr')[0]
      const claimActionButton = tr
        .querySelectorAll('td')[3]
        .querySelector('button')
      expect(claimActionButton).toBeInTheDocument()
    })

    test('simulate claim action button click', () => {
      const tbody = screen.getByTestId('app-table-body')
      const tr = tbody.querySelectorAll('tr')[0]
      const claimActionButton = tr
        .querySelectorAll('td')[3]
        .querySelector('button')

      fireEvent.click(claimActionButton)
    })
  })
})
