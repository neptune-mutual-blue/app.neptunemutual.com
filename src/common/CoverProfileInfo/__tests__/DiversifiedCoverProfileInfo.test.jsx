import { DiversifiedCoverProfileInfo } from '@/common/CoverProfileInfo/DiversifiedCoverProfileInfo'
import { i18n } from '@lingui/core'
import { act, render, screen } from '@testing-library/react'

describe('DiversifiedCoverProfileInfo test', () => {
  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
    render(<DiversifiedCoverProfileInfo projectName='1inch' />)
  })

  test('should render Provide liquidity and project name on container', () => {
    const provide = screen.getByText('Provide Liquidity')
    const projectName = screen.getByText('1inch')

    expect(provide).toBeInTheDocument()
    expect(projectName).toBeInTheDocument()
  })
})
