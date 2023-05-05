// import { DropdownOption } from '@/modules/reporting/DropdownOption'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('DropdownOption test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockFn.useAppConstants()
    // mockFn.useCoverOrProductData()
  })

  test('should render the option name correctly', () => {
    // render(
    //   <DropdownOption
    //     option={testData.covers[0]}
    //     selected={testData.covers[0]}
    //   />
    // )
    const wrapper = screen.getByText(testData.covers[0].coverName)
    expect(wrapper).toBeInTheDocument()
  })
})
