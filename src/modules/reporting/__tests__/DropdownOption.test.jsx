// import { DropdownOption } from '@/modules/reporting/DropdownOption'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('DropdownOption test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useAppConstants()
    // mockHooksOrMethods.useCoverOrProductData()
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
