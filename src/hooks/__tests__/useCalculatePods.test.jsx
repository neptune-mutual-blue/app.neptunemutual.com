import { renderHook } from "@testing-library/react-hooks";
import { useCalculatePods } from "../useCalculatePods";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import { TxPosterProvider } from "@/src/context/TxPoster";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  value: 1000,
  podAddress: "0xBD85714f56622BDec5599BA965E60d01d4943540",
};

describe("useCalculatePods", () => {
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
        useCalculatePods({
          coverKey: mockProps.coverKey,
          value: mockProps.value,
          podAddress: mockProps.podAddress,
        }),
      {
        wrapper,
      }
    );

    expect(result.current.receiveAmount).toEqual("0");
    expect(result.current.loading).toBe(false);
  });
});
