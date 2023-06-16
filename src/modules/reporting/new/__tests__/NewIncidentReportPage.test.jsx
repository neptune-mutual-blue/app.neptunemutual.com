import React from 'react'

import { NewIncidentReportPage } from '@/modules/reporting/new'
import { createMockRouter } from '@/utils/unit-tests/createMockRouter'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import {
  act,
  fireEvent,
  render,
  waitFor,
  withProviders
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('NewIncidentReportPage.test', () => {
  beforeAll(async () => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should show incident report form after accepting rules', async () => {
    const router = createMockRouter({
      query: { id: 'animated-brands' }
    })

    mockHooksOrMethods.useCoversAndProducts2()

    const Component = withProviders(NewIncidentReportPage, router)
    const { getByTestId } = render(<Component />)

    await waitFor(() => {
      expect(getByTestId('accept-report-rules-check-box')).toBeInTheDocument()
    })

    const acceptRulesCheckbox = getByTestId('accept-report-rules-check-box')
    const acceptRulesNextButton = getByTestId(
      'accept-report-rules-next-button'
    )

    fireEvent.click(acceptRulesCheckbox)
    fireEvent.click(acceptRulesNextButton)

    expect(getByTestId('incident-report-form')).toBeInTheDocument()
  })
})
