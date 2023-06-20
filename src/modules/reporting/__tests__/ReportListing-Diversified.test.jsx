import ReportListing from '@/modules/reporting/ReportListing'
import { ChainConfig } from '@/src/config/hardcoded'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react'

describe('ReportListing test', () => {
  let initialRender
  const push = jest.fn(() => {})

  beforeEach(() => {
    const { initialRender: iR } = initiateTest(
      ReportListing,
      { coverKey: 'animated-brands', productKey: '', locale: 'en' },
      () => {
        mockHooksOrMethods.useRouter(() => { return { ...testData.router, push } })
        mockHooksOrMethods.useCoversAndProducts2()
        mockHooksOrMethods.useSubgraphFetch(async () => {
          return {
            incidentReports: [
              {
                id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1661401286',
                coverKey:
                '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
                productKey:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                incidentDate: '1661401286',
                resolved: true,
                status: 'Claimable',
                totalAttestedStake: '3400000000000000000000',
                totalRefutedStake: '0',
                reporter: '0x88ffacb1bbb771af326e6dfd9e0e8ea3e4e0e306'
              },
              {
                id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1661056509',
                coverKey:
                '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
                productKey:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                incidentDate: '1661056509',
                resolved: true,
                status: 'Claimable',
                totalAttestedStake: '3400000000000000000000',
                totalRefutedStake: '0',
                reporter: '0x201bcc0d375f10543e585fbb883b36c715c959b3'
              },
              {
                id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1660719202',
                coverKey:
                '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
                productKey:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                incidentDate: '1660719202',
                resolved: true,
                status: 'FalseReporting',
                totalAttestedStake: '3400000000000000000000',
                totalRefutedStake: '0',
                reporter: '0x794089c95952a4f2c381e25c36245f265c2ae965'
              },
              {
                id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1659338824',
                coverKey:
                '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
                productKey:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                incidentDate: '1659338824',
                resolved: true,
                status: 'Claimable',
                totalAttestedStake: '3400000000000000000000',
                totalRefutedStake: '0',
                reporter: '0x794089c95952a4f2c381e25c36245f265c2ae965'
              },
              {
                id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1658995751',
                coverKey:
                '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
                productKey:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                incidentDate: '1658995751',
                resolved: true,
                status: 'Claimable',
                totalAttestedStake: '4634000000000000000000',
                totalRefutedStake: '3400000000000000000000',
                reporter: '0x9bdae2a084ec18528b78e90b38d1a67c79f6cab6'
              },
              {
                id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1658303011',
                coverKey:
                '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
                productKey:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                incidentDate: '1658303011',
                resolved: true,
                status: 'FalseReporting',
                totalAttestedStake: '3400000000000000000000',
                totalRefutedStake: '0',
                reporter: '0x767aaa0a901f865e80d0fe9841f34a2239a1f8c0'
              },
              {
                id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1658207714',
                coverKey:
                '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
                productKey:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                incidentDate: '1658207714',
                resolved: true,
                status: 'Claimable',
                totalAttestedStake: '3400000000000000000000',
                totalRefutedStake: '0',
                reporter: '0x767aaa0a901f865e80d0fe9841f34a2239a1f8c0'
              }
            ]
          }
        })
      }
    )
    initialRender = iR
  })

  describe('Decicated cover', () => {
    test('Should display reports', async () => {
      await waitFor(() => {
        initialRender()
      })

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()

      const randomReporter = screen.getByText('0x88....e306')
      expect(randomReporter).toBeInTheDocument()

      const chainConfig = ChainConfig[1]

      const formattedTotalAttestedStake = formatCurrency(
        convertFromUnits('4634000000000000000000', chainConfig.npm.tokenDecimals),
        'en-US',
        chainConfig.npm.tokenSymbol,
        true
      )

      const randoTotallyAttestedStake = screen.getByText(formattedTotalAttestedStake.long)
      expect(randoTotallyAttestedStake).toBeInTheDocument()

      const rows = screen.getAllByRole('cell')
      // 7 rows 5 columns
      expect(rows.length).toBe(7 * 5)

      fireEvent.click(rows[0])

      expect(push).toBeCalled()
    })
  })
})
