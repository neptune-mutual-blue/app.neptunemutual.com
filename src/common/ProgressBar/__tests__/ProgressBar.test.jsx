import { ProgressBar } from '@/common/ProgressBar/ProgressBar'
import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ProgressBar component behaviour', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render ProgressBar component', () => {
    render(<ProgressBar value='0.8' />)
  })
})
