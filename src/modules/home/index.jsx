import React from 'react'

import { AvailableCovers } from '@/modules/home/AvailableCovers'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { Insights } from '@/modules/insights'

export default function HomePage () {
  return (
    <>
      <Insights />

      <SortableStatsProvider>
        <AvailableCovers />
      </SortableStatsProvider>
    </>
  )
}
