import React from 'react'
import { render, screen } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { testData } from '@/utils/unit-tests/test-data'
import { DescriptionComponent } from '@/modules/my-policies/PurchasePolicyReceipt/DescriptionComponent'

const text = {
  coverRules: [
    'Carefully read the following terms and conditions. For a successful claim payout, all of the following points must be true.',
    [testData.coverInfo.infoObj.rules.split('\n')]
  ]
}

describe('DescriptionComponent test', () => {
  beforeEach(() => {
    i18n.activate('en')

    // mockHooksOrMethods.useCovers();
    // mockHooksOrMethods.useFlattenedCoverProducts();
    // mockHooksOrMethods.useCoverOrProductData();

    render(
      <DescriptionComponent
        title='Cover Rules'
        text={text.coverRules}
        className='mt-14'
        bullets
      />
    )
  })

  test('should render the title correctly', () => {
    const wrapper = screen.getByText('Cover Rules')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the rules correctly', () => {
    const wrapper = screen.getByText(text.coverRules[0])
    expect(wrapper).toBeInTheDocument()
  })
})

describe('DescriptionComponent test', () => {
  test('should render the bullet styles if bullets props is passed as true', () => {
    const screen = render(
      <DescriptionComponent
        title='Cover Rules'
        text={text.coverRules}
        className='mt-14'
        bullets
      />
    )
    const wrapper = screen.container.getElementsByClassName('list-disc')
    expect(wrapper.length).toBe(2)
  })
})
