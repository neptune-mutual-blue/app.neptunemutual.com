import React from 'react'

import { AvailableCovers } from '@/modules/home/AvailableCovers'
import { Insights } from '@/modules/insights'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'

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
