import React from 'react'

import { AvailableCovers } from '@/modules/home/AvailableCovers'
import { HomeHero } from '@/modules/home/Hero'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'

export default function HomePage () {
  return (
    <>
      <HomeHero />

      <SortableStatsProvider>
        <AvailableCovers />
      </SortableStatsProvider>
    </>
  )
}
