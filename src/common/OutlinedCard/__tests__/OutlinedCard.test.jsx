import { render, act } from '@/utils/unit-tests/test-utils'
import { OutlinedCard } from '../OutlinedCard'
import { i18n } from '@lingui/core'

describe('OutlinedCard component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render OutlinedCard children component', () => {
    const { getByText } = render(
      <OutlinedCard>
        <div>Child Component</div>
      </OutlinedCard>
    )

    const childComponent = getByText('Child Component')
    expect(childComponent).toBeInTheDocument()
  })

  test('can add classNames as prop', () => {
    const { getByTestId } = render(
      <OutlinedCard className='outline-card-mock-classname'>
        <div>Child Component</div>
      </OutlinedCard>
    )

    const childComponent = getByTestId('card-outline')
    expect(childComponent).toHaveClass('outline-card-mock-classname')
  })

  test('can add type as prop', () => {
    const { getByTestId } = render(
      <OutlinedCard type='link'>
        <div>Child Component</div>
      </OutlinedCard>
    )

    const childComponent = getByTestId('card-outline')
    expect(childComponent).toHaveClass(
      'transition duration-150 ease-out hover:ease-in hover:shadow-card'
    )
  })
})
