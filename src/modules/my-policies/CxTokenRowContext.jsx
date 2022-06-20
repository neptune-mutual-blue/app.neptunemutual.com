import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import React from "react";

const CxTokenRowContext = React.createContext({
  tokenSymbol: "",
  balance: "0",
  refetchBalance: async () => {},
});

export const CxTokenRowProvider = ({ row, _extraData, ...props }) => {
  const tokenAddress = row.cxToken.id;
  const tokenSymbol = useTokenSymbol(tokenAddress);
  const {
    balance,
    loading: loadingBalance,
    refetch: refetchBalance,
  } = useERC20Balance(tokenAddress);

  return (
    <CxTokenRowContext.Provider
      value={{ tokenSymbol, tokenAddress, balance, loadingBalance, refetchBalance }}
      {...props}
    />
  );
};

export function useCxTokenRowContext() {
  const context = React.useContext(CxTokenRowContext);
  if (context === undefined) {
    throw new Error(
      "useCxTokenRowContext must be used within a CxTokenRowContext.Provider"
    );
  }
  return context;
}
