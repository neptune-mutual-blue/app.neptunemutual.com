import React from 'react'
import { render, act } from '@/utils/unit-tests/test-utils'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { i18n } from '@lingui/core'

const CARDS_PER_PAGE = 5
const LINE_CONTENT_PER_CARD = 4

describe('CardSkeleton', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })
  describe('should render CardSkeleton properly', () => {
    beforeAll(() => {
      act(() => {
        i18n.activate('en')
      })
    })

    test('has correct number of cards and line content', async () => {
      const { getAllByTestId } = render(
        <CardSkeleton
          numberOfCards={CARDS_PER_PAGE}
          lineContent={LINE_CONTENT_PER_CARD}
        />
      )

      const cards = getAllByTestId('card-outline')
      const lineContent = getAllByTestId('card-line-content')

      expect(cards).toHaveLength(CARDS_PER_PAGE)
      expect(lineContent).toHaveLength(LINE_CONTENT_PER_CARD * CARDS_PER_PAGE)
    })

    test('show status badge and subtitle', () => {
      const { getAllByTestId } = render(
        <CardSkeleton statusBadge subTitle numberOfCards={CARDS_PER_PAGE} />
      )

      const subtitle = getAllByTestId('card-subtitle')
      const statusBadge = getAllByTestId('card-status-badge')

      expect(subtitle).toHaveLength(CARDS_PER_PAGE)
      expect(statusBadge).toHaveLength(CARDS_PER_PAGE)
    })
  })
})
