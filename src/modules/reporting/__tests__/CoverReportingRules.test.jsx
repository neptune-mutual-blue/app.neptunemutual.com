import { CoverReportingRules } from '@/modules/reporting/CoverReportingRules'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('CoverReportingRules test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useAppConstants()
    // mockHooksOrMethods.useCoverOrProductData()
  })

  test('should render the button with report an incident', () => {
    render(
      <CoverReportingRules
        coverOrProductData={testData.coverInfo}
        activeReportings={[]}
        handleAcceptRules={() => {}}
      />
    )
    const wrapper = screen.getByTestId('accept-report-rules-next-button')
    expect(wrapper).toHaveTextContent('REPORT AN INCIDENT')
  })

  test('should render reporting info if active reporting is not empty', () => {
    render(
      <CoverReportingRules
        coverOrProductData={testData.coverInfo}
        activeReportings={[
          {
            id: '',
            reporterInfo:
              '{\n  "key": "0x616e696d617465642d6272616e64730000000000000000000000000000000000",\n  "coverName": "Animated Brands",\n  "projectName": "Animated Brands",\n  "vault": {\n    "name": "Animated Brands POD",\n    "symbol": "AB-nDAI"\n  },\n  "requiresWhitelist": false,\n  "supportsProducts": false,\n  "leverage": "1",\n  "tags": [\n    "Smart Contract",\n    "NFT",\n    "Gaming"\n  ],\n  "about": "Animated Brands is a Thailand based gaming company, and a venture capitalist firm founded in 2017 by Jack D\'Souza. It was listed on Singapore Exchange (SGX) from 23rd May, 2019.",\n  "rules": "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.",\n  "exclusions": "",\n  "links": {\n    "website": "https://www.animatedbrands.com",\n    "twitter": "https://twitter.com/animatedbrands",\n    "blog": "https://animatedbrands.medium.com",\n    "linkedin": "https://www.linkedin.com/company/animated-brands"\n  },\n  "pricingFloor": "700",\n  "pricingCeiling": "2400",\n  "reportingPeriod": 1800,\n  "cooldownPeriod": 300,\n  "claimPeriod": 1800,\n  "minReportingStake": "3400000000000000000000",\n  "resolutionSources": [\n    "https://twitter.com/animatedbrands",\n    "https://twitter.com/neptunemutual"\n  ],\n  "stakeWithFees": "50000000000000000000000",\n  "reassurance": "10000000000",\n  "reassuranceRate": "2500"\n}'
          }
        ]}
        handleAcceptRules={() => {}}
      />
    )
    const wrapper = screen.getByText(/Reporting Info/i)
    expect(wrapper).toBeInTheDocument()
  })
})
