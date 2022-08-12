import { renderHook } from "@testing-library/react-hooks";
import { useActivePolicies } from "../useActivePolicies";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import BigNumber from "bignumber.js";

describe("useActivePolicies", () => {
  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>{children}</NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(() => useActivePolicies(), { wrapper });

    expect(result.current.data.activePolicies).toEqual([]);
    expect(result.current.data.totalActiveProtection).toEqual(
      new BigNumber("0")
    );
    expect(result.current.loading).toBe(false);
  });
});
