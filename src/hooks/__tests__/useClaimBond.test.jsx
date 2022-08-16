import { renderHook } from "@testing-library/react-hooks";
import { useClaimBond } from "../useClaimBond";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import { TxPosterProvider } from "@/src/context/TxPoster";
import { AppConstantsProvider } from "@/src/context/AppConstants";
import { ToastProvider } from "@/lib/toast/provider";
import { DEFAULT_VARIANT } from "@/src/config/toast";

const unmockedFetch = global.fetch;

describe("useClaimBond", () => {
  beforeAll(() => {
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>
          <AppConstantsProvider>
            <ToastProvider variant={DEFAULT_VARIANT}>
              <TxPosterProvider>{children}</TxPosterProvider>
            </ToastProvider>
          </AppConstantsProvider>
        </NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(() => useClaimBond(), {
      wrapper,
    });

    expect(result.current.handleClaim).toEqual(expect.any(Function));
    expect(result.current.claiming).toBe(false);
  });
});
