import {
  render,
  act
} from '@/utils/unit-tests/test-utils'
import { Grid } from '../Grid'
import { i18n } from '@lingui/core'

describe('Grid component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render Grid children component', () => {
    const { getByText } = render(
      <Grid>
        <div>Child Component</div>
      </Grid>
    )

    const childComponent = getByText('Child Component')
    expect(childComponent).toBeInTheDocument()
  })

  test('can add classNames as prop', () => {
    const { getByTestId } = render(
      <Grid className='grid-mock-classname'>
        <div>Child Component</div>
      </Grid>
    )

    const childComponent = getByTestId('grid-mock-component')
    expect(childComponent).toHaveClass('grid-mock-classname')
  })
})
