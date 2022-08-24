import { renderHook } from "@testing-library/react-hooks";
import { useCalculateLiquidity } from "../useCalculateLiquidity";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import { TxPosterProvider } from "@/src/context/TxPoster";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  podAmount: 1000,
};

describe("useCalculateLiquidity", () => {
  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>
          <TxPosterProvider>{children}</TxPosterProvider>
        </NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(
      () =>
        useCalculateLiquidity({
          coverKey: mockProps.coverKey,
          podAmount: mockProps.podAmount,
        }),
      {
        wrapper,
      }
    );

    expect(result.current.receiveAmount).toEqual("0");
    expect(result.current.loading).toBe(false);
  });
});
