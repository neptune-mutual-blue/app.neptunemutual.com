import React from 'react'
import { render, screen, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { TagsInput } from '@/common/TagsInput/TagsInput'
import { i18n } from '@lingui/core'

describe('TagsInput test', () => {
  beforeEach(async () => {
    act(() => {
      i18n.activate('en')
    })
    const props = {
      selectedTags: jest.fn(),
      className: ''
    }
    render(<TagsInput {...props} />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('tags-input-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render input field without fail', async () => {
    const input = screen.getByTestId('input')
    expect(input).toBeInTheDocument()
  })

  test('should not render any tag items by default', async () => {
    const items = screen.queryAllByTestId('tag-item')
    expect(items.length).toBe(0)
  })

  test('should render tags when input is updated', async () => {
    const input = screen.getByTestId('input')
    fireEvent.keyUp(input, { target: { value: 'mytag,' }, key: ',' })
    const items = screen.getAllByTestId('tag-item')
    expect(items.length).toBe(1)
  })

  test('should not create tags when input value is not suffixed by a comma(,)', async () => {
    const input = screen.getByTestId('input')
    fireEvent.keyUp(input, { target: { value: 'mytag' } })
    const items = screen.queryAllByTestId('tag-item')
    expect(items.length).toBe(0)
  })

  test('should render correct number of tags', async () => {
    const input = screen.getByTestId('input')
    fireEvent.keyUp(input, { target: { value: 'mytag1' }, key: ',' })
    fireEvent.keyUp(input, { target: { value: 'mytag2' }, key: ',' })
    fireEvent.keyUp(input, { target: { value: 'mytag3' }, key: ',' })
    const items = screen.queryAllByTestId('tag-item')
    expect(items.length).toBe(3)
  })

  test('simulate deleting tags', async () => {
    const input = screen.getByTestId('input')
    fireEvent.keyUp(input, { target: { value: 'mytag' }, key: ',' })
    let tags = screen.queryAllByTestId('tag-item')
    expect(tags.length).toBe(1)
    const removeBtn = screen.queryAllByTestId('tag-remove-btn')
    fireEvent.click(removeBtn[0])
    tags = screen.queryAllByTestId('tag-item')
    expect(tags.length).toBe(0)
  })
})
