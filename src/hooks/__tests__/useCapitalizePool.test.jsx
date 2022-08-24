import { renderHook } from "@testing-library/react-hooks";
import { useCapitalizePool } from "../useCapitalizePool";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import { TxPosterProvider } from "@/src/context/TxPoster";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x62616c616e636572000000000000000000000000000000000000000000000000",
  incidentDate: "",
};

describe("useCapitalizePool", () => {
  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>
          <TxPosterProvider>{children}</TxPosterProvider>
        </NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(() => useCapitalizePool(mockProps), {
      wrapper,
    });

    expect(result.current.capitalize).toEqual(expect.any(Function));
    expect(result.current.capitalizing).toBe(false);
  });
});
