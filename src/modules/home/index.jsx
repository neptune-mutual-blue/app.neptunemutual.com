import React from "react";

import { AvailableCovers } from "@/modules/home/AvailableCovers";
import { HomeHero } from "@/modules/home/Hero";
import { SortableStatsProvider } from "@/src/context/SortableStatsContext";
import { isV2BasketCoverEnabled } from "@/src/config/environment";
import { AllCovers } from "@/modules/home/AllCovers";
import { AvailableProducts } from "@/modules/home/AvailableProducts";

export default function HomePage({ showDiversifiedList = false }) {
  const v2Enabled = isV2BasketCoverEnabled();
  return (
    <>
      <HomeHero />
      <SortableStatsProvider>
        {showDiversifiedList ? (
          <AvailableProducts />
        ) : v2Enabled ? (
          <AllCovers />
        ) : (
          <AvailableCovers />
        )}
      </SortableStatsProvider>
    </>
  );
}
