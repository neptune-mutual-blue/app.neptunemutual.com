import { renderHook } from "@testing-library/react-hooks";
import { useActivePoliciesByCover } from "../useActivePoliciesByCover";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import BigNumber from "bignumber.js";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x62616c616e636572000000000000000000000000000000000000000000000000",
  page: 1,
  limit: 50,
};

describe("useActivePoliciesByCover", () => {
  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>{children}</NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(
      () =>
        useActivePoliciesByCover({
          coverKey: mockProps.coverKey,
          productKey: mockProps.productKey,
          page: mockProps.page,
          limit: mockProps.limit,
        }),
      {
        wrapper,
      }
    );
    console.log("result", result.current);
    expect(result.current.data.activePolicies).toEqual([]);
    expect(result.current.data.totalActiveProtection).toEqual(
      new BigNumber("0")
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });
});
