import { screen, act, render, fireEvent } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { AcceptReportRulesForm } from '@/common/AcceptCoverRulesForm/AcceptReportRulesForm'

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
      <AcceptReportRulesForm onAccept={handleSubmit}>
        This shows forms text.
      </AcceptReportRulesForm>
    )
    const checkBox = screen.getByRole('checkbox')
    const button = screen.getByRole('button')
    fireEvent.click(checkBox)
    expect(checkBox.checked).toEqual(true)
    fireEvent.click(button)
    expect(handleSubmit).toBeCalledTimes(1)
  })
})
