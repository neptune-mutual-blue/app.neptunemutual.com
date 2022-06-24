import { createContext, useContext } from "react";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";

const defaultStats = {
  activeIncidentDate: "0",
  claimPlatformFee: "0",
  activeCommitment: "0",
  availableLiquidity: "0",
  isUserWhitelisted: false,
  reporterCommission: "0",
  reportingPeriod: "0",
  requiresWhitelist: false,
  coverStatus: "",
  productStatus: "",
  totalPoolAmount: "0",
};

const CoverStatsContext = createContext(defaultStats);

export const CoverStatsProvider = ({
  coverKey,
  productKey = safeFormatBytes32String(""),
  children,
}) => {
  const {
    activeIncidentDate,
    claimPlatformFee,
    activeCommitment,
    isUserWhitelisted,
    reporterCommission,
    reportingPeriod,
    requiresWhitelist,
    coverStatus,
    productStatus,
    totalPoolAmount,
    availableLiquidity,
  } = useFetchCoverStats({
    coverKey,
    productKey,
  });

  return (
    <CoverStatsContext.Provider
      value={{
        activeIncidentDate,
        claimPlatformFee,
        activeCommitment,
        isUserWhitelisted,
        reporterCommission,
        reportingPeriod,
        requiresWhitelist,
        availableLiquidity,
        coverStatus,
        productStatus,
        totalPoolAmount,
      }}
    >
      {children}
    </CoverStatsContext.Provider>
  );
};

export function useCoverStatsContext() {
  const context = useContext(CoverStatsContext);
  if (context === undefined) {
    throw new Error(
      "useCoverStatsContext must be used within a CoverStatsContext.Provider"
    );
  }
  return context;
}
