import { renderHook } from "@testing-library/react-hooks";
import { useAuthValidation } from "../useAuthValidation";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { ToastProvider } from "@/lib/toast/provider";
import { DEFAULT_VARIANT } from "@/src/config/toast";

describe("useAuthValidation", () => {
  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <ToastProvider variant={DEFAULT_VARIANT}>{children}</ToastProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(() => useAuthValidation(), { wrapper });

    expect(result.current.requiresAuth).toEqual(expect.any(Function));
  });
});
