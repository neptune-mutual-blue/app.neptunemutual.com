import { screen, act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { HomeMainCard } from '@/common/HomeCard/HomeMainCard'

describe('HomeMainCard component behaviour', () => {
  const heroData = {
    availableCovers: 9,
    reportingCovers: 4
  }

  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render homemain card component', () => {
    render(<HomeMainCard heroData={heroData} />)
    const available = screen.getByText(/Available/i)
    const reporting = screen.getByText(/Reporting/i)
    const noOfAvailable = screen.getByText(heroData.availableCovers)
    const noOfReporting = screen.getByText(heroData.reportingCovers)
    expect(available).toBeInTheDocument()
    expect(reporting).toBeInTheDocument()
    expect(noOfAvailable).toBeInTheDocument()
    expect(noOfReporting).toBeInTheDocument()
  })
})
