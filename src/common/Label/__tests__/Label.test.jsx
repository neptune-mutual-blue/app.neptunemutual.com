import {
  render,
  act
} from '@/utils/unit-tests/test-utils'
import { Label } from '../Label'
import { i18n } from '@lingui/core'

describe('Label component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render Label children component', () => {
    const { getByText } = render(
      <Label>
        <div>Child Component</div>
      </Label>
    )

    const childComponent = getByText('Child Component')
    expect(childComponent).toBeInTheDocument()
  })

  test('can add classNames as prop', () => {
    const { getByTestId } = render(
      <Label className='label-mock-classname'>
        <div>Child Component</div>
      </Label>
    )

    const childComponent = getByTestId('label-mock-component')
    expect(childComponent).toHaveClass('label-mock-classname')
  })
})
