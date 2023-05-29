import { ReportingInfo } from '@/modules/reporting/ReportingInfo'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'
import { i18n } from '@lingui/core'
import {
  screen,
  waitFor
} from '@testing-library/react'

jest.mock('@neptunemutual/sdk')

describe('Reporting Info', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockSdk.utils.ipfs.readBytes32(
      testData.reporting.activeReporting[0].reporterInfo
    )

    const { initialRender } = initiateTest(ReportingInfo, {
      ipfsHash: testData.reporting.activeReporting[0].reporterInfo
    })

    initialRender()
  })

  test('should render the ipfsData', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('reporter-info-ipfs-data').innerHTML).toBe(
        `"${testData.reporting.activeReporting[0].reporterInfo}"`
      )
    })
  })
})
