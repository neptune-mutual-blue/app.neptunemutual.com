import { createContext, useContext } from "react";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";

const defaultStats = {
  activeIncidentDate: "0",
  claimPlatformFee: "0",
  activeCommitment: "0",
  isUserWhitelisted: false,
  reporterCommission: "0",
  reportingPeriod: "0",
  requiresWhitelist: false,
  status: "",
  totalPoolAmount: "0",
};

const CoverStatsContext = createContext(defaultStats);

export const CoverStatsProvider = ({ coverKey, children }) => {
  const {
    activeIncidentDate,
    claimPlatformFee,
    activeCommitment,
    isUserWhitelisted,
    reporterCommission,
    reportingPeriod,
    requiresWhitelist,
    status,
    totalPoolAmount,
  } = useFetchCoverStats({ coverKey });

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
        status,
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
