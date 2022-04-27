import { createContext, useContext } from "react";
import { useFetchCoverInfo } from "@/src/hooks/useFetchCoverInfo";

const defaultInfo = {
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

const CoverInfoContext = createContext(defaultInfo);

export const CoverInfoProvider = ({ coverKey, children }) => {
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
  } = useFetchCoverInfo({ coverKey });

  return (
    <CoverInfoContext.Provider
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
    </CoverInfoContext.Provider>
  );
};

export function useCoverInfoContext() {
  const context = useContext(CoverInfoContext);
  if (context === undefined) {
    throw new Error(
      "useCoverInfoContext must be used within a CoverInfoContext.Provider"
    );
  }
  return context;
}
