import { renderHook } from "@testing-library/react-hooks";
import { useClaimPolicyInfo } from "../useClaimPolicyInfo";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import { TxPosterProvider } from "@/src/context/TxPoster";
import { ToastProvider } from "@/lib/toast/provider";
import { DEFAULT_VARIANT } from "@/src/config/toast";

const mockProps = {
  value: "",
  cxTokenAddress: "",
  cxTokenDecimals: "",
  coverKey: "",
  productKey: "",
  incidentDate: "",
  claimPlatformFee: "",
  tokenSymbol: "",
};

describe("useClaimPolicyInfo", () => {
  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>
          <ToastProvider variant={DEFAULT_VARIANT}>
            <TxPosterProvider>{children}</TxPosterProvider>
          </ToastProvider>
        </NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(() => useClaimPolicyInfo(mockProps), {
      wrapper,
    });

    expect(result.current.claiming).toBe(false);
    expect(result.current.handleClaim).toEqual(expect.any(Function));
    expect(result.current.canClaim).toEqual("");
    expect(result.current.loadingAllowance).toBe(false);
    expect(result.current.approving).toBe(false);
    expect(result.current.handleApprove).toEqual(expect.any(Function));
    expect(result.current.error).toEqual("");
    expect(result.current.receiveAmount).toEqual("0");
    expect(result.current.claimPlatformFee).toEqual("");
  });
});
