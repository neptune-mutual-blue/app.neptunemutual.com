import { act, render, fireEvent } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { Trans } from '@lingui/macro'

describe('Checkbox component behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const handleChange = jest.fn()
  test('should render checkbox', () => {
    const screen = render(
      <Checkbox
        id='checkid'
        name='checkinputname'
        checked={false}
        onChange={handleChange}
      >
        <Trans>
          I have read, understood, and agree to the terms of cover rules
        </Trans>
      </Checkbox>
    )
    const checkBox = screen.getByRole('checkbox')
    expect(checkBox).toBeInTheDocument()
    expect(checkBox).not.toBeChecked()
  })

  test('should change the state of checkbox', () => {
    const screen = render(
      <Checkbox id='checkid' name='checkinputname' onChange={handleChange}>
        <Trans>
          I have read, understood, and agree to the terms of cover rules
        </Trans>
      </Checkbox>
    )
    const checkBox = screen.getByRole('checkbox')
    fireEvent.click(checkBox)
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(checkBox).toBeChecked()
  })
})
