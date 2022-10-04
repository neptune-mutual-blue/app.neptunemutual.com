import { render, act } from '@/utils/unit-tests/test-utils'
import { SecondaryCard } from '../SecondaryCard'
import { i18n } from '@lingui/core'

describe('should render BackButton Component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render any children passed to it', () => {
    const { getByText } = render(<SecondaryCard>Secondary Card</SecondaryCard>)
    const component = getByText('Secondary Card')

    expect(component).toBeInTheDocument()
  })
})
