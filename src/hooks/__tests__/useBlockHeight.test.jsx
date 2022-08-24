import { renderHook } from "@testing-library/react-hooks";
import { useBlockHeight } from "../useBlockHeight";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";

describe("useBlockHeight", () => {
  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>{children}</NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(() => useBlockHeight(), { wrapper });

    expect(result.current).toEqual(1);
  });
});
