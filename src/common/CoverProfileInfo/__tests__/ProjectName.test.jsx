import React from 'react'
import { render, screen, act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { ProjectName } from '@/common/CoverProfileInfo/ProjectName'

describe('ProjectName test', () => {
  const props = {
    name: 'Animated Brands'
  }

  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
    render(<ProjectName {...props} />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('projectname-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct name as provided in props', () => {
    const wrapper = screen.getByTestId('projectname-container')
    expect(wrapper).toHaveTextContent(props.name)
  })
})
