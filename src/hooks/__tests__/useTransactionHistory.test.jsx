import { useTransactionHistory } from "@/src/hooks/useTransactionHistory";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useTransactionHistory", () => {
  mockFn.useWeb3React(() => ({
    ...testData.account,
    library: { provider: true },
  }));
  mockFn.useNetwork();
  mockFn.useTxToast();
  mockFn.utilsWeb3.getProviderOrSigner();

  test("should execute the hook properly ", async () => {
    mockFn.TransactionHistory.callback();
    await renderHookWrapper(useTransactionHistory);
    mockFn.TransactionHistory.callback(false);
  });

  describe("Edge cases coverage", () => {
    test("should return if no netowrkId, account ", async () => {
      mockFn.useNetwork(() => ({ networkId: null }));
      mockFn.useWeb3React(() => ({
        account: null,
        library: null,
      }));

      await renderHookWrapper(useTransactionHistory);
      mockFn.useNetwork();
      mockFn.useWeb3React(() => ({
        ...testData.account,
        library: { provider: true },
      }));
    });

    test("should return if no provider ", async () => {
      mockFn.utilsWeb3.getProviderOrSigner(() => ({
        ...testData.providerOrSigner,
        provider: null,
      }));

      await renderHookWrapper(useTransactionHistory);
      mockFn.utilsWeb3.getProviderOrSigner();
    });
  });
});
