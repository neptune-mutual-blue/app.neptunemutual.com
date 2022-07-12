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
  productStatus: "",
  totalPoolAmount: "0",
  refetch: async (f) => f,
};

const CoverStatsContext = createContext(defaultStats);

export const CoverStatsProvider = ({
  coverKey,
  productKey = safeFormatBytes32String(""),
  children,
}) => {
  const { info, refetch } = useFetchCoverStats({
    coverKey,
    productKey,
  });

  const {
    activeIncidentDate,
    claimPlatformFee,
    activeCommitment,
    isUserWhitelisted,
    reporterCommission,
    reportingPeriod,
    requiresWhitelist,
    productStatus,
    totalPoolAmount,
    availableLiquidity,
  } = info;

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
        productStatus,
        totalPoolAmount,
        refetch,
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
