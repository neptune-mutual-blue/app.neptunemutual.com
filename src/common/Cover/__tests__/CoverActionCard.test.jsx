import { CoverActionCard } from '@/common/Cover/CoverActionCard'
import { screen, act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('CoverActionCard component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  const mockProps = {
    title: 'Provide Liquidity',
    description: 'to pool risks and receive rewards',
    imgSrc: '/cover-actions/add-liquidity.svg'
  }

  test('should render title passed to it', () => {
    render(
      <CoverActionCard
        title={mockProps.title}
        description={mockProps.description}
        imgSrc={mockProps.imgSrc}
      />
    )
    const titleElement = screen.getByRole('heading', { level: 4 })
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent(mockProps.title)
  })

  test('should render description passed to it', () => {
    render(
      <CoverActionCard
        title={mockProps.title}
        description={mockProps.description}
        imgSrc={mockProps.imgSrc}
      />
    )
    const description = screen.getByText(/pool risks and receive rewards/i)
    expect(description).toBeInTheDocument()
  })

  test('should render img passed to it', () => {
    const screen = render(
      <CoverActionCard
        title={mockProps.title}
        description={mockProps.description}
        imgSrc={mockProps.imgSrc}
      />
    )
    const imageElement = screen.getByRole('img')
    expect(imageElement).toBeInTheDocument()
    expect(imageElement).toHaveAttribute('src', mockProps.imgSrc)
  })
})
