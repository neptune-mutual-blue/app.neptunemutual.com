import { createContext, useContext } from "react";
import { useFetchCoverStats } from "@/src/hooks/useFetchCoverStats";

const defaultStats = {
  activeIncidentDate: "0",
  claimPlatformFee: "0",
  commitment: "0",
  isUserWhitelisted: false,
  reporterCommission: "0",
  reportingPeriod: "0",
  requiresWhitelist: false,
  status: "",
  totalCommitment: "0",
  totalPoolAmount: "0",
};

const CoverStatsContext = createContext(defaultStats);

export const CoverStatsProvider = ({ coverKey, children }) => {
  const {
    activeIncidentDate,
    claimPlatformFee,
    commitment,
    isUserWhitelisted,
    reporterCommission,
    reportingPeriod,
    requiresWhitelist,
    status,
    totalCommitment,
    totalPoolAmount,
  } = useFetchCoverStats({ coverKey });

  return (
    <CoverStatsContext.Provider
      value={{
        activeIncidentDate,
        claimPlatformFee,
        commitment,
        isUserWhitelisted,
        reporterCommission,
        reportingPeriod,
        requiresWhitelist,
        status,
        totalCommitment,
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
