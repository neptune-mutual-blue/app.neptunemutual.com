import {
  AcceptReportRulesForm
} from '@/common/AcceptCoverRulesForm/AcceptReportRulesForm'
import { AcceptRulesForm } from '@/common/AcceptRulesForm/AcceptRulesForm'
import {
  act,
  fireEvent,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

// import * as coverStatsContext from '@/common/Cover/CoverStatsContext'

describe('AcceptReportRules component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const handleSubmit = jest.fn()

  test('should render any children passed to it', () => {
    render(
      <AcceptReportRulesForm>This shows forms text.</AcceptReportRulesForm>
    )
    const divElement = screen.getByText(/This shows forms text./i)
    expect(divElement).toBeInTheDocument()
  })

  test('should submit a form on clicking button', () => {
    const screen = render(
      <AcceptRulesForm onAccept={handleSubmit}>
        This shows forms text.
      </AcceptRulesForm>
    )
    const checkBox = screen.getByRole('checkbox')
    const button = screen.getByRole('button')
    fireEvent.click(checkBox)
    expect(checkBox.checked).toEqual(true)
    fireEvent.click(button)
    expect(handleSubmit).toBeCalledTimes(1)
  })

  describe('Status not normal', () => {
    // beforeEach(() => {
    //   jest
    //     .spyOn(coverStatsContext, 'useCoverStatsContext')
    //     .mockImplementation(() => ({
    //       productStatus: 'NOT NORMAL',
    //       activeIncidentDate: '12232323',
    //       claimPlatformFee: '0',
    //       commitment: '0',
    //       isUserWhitelisted: false,
    //       reporterCommission: '0',
    //       reportingPeriod: '0',
    //       requiresWhitelist: false,
    //       activeCommitment: '0',
    //       totalPoolAmount: '0',
    //       availableLiquidity: '0',
    //       refetch: () => Promise.resolve(1)
    //     }))
    // })

    test('should show error because status is not normal', () => {
      const screen = render(
        <AcceptRulesForm onAccept={handleSubmit}>
          This shows forms text.
        </AcceptRulesForm>
      )

      const divElement = screen.getByText(/since the cover status is/i)
      expect(divElement).toBeInTheDocument()

      const statusMessage = screen.getByText(/NOT NORMAL/i)
      expect(statusMessage).toBeInTheDocument()
    })
  })
})
