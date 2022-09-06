import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";
import { useClaimsProcessorAddress } from "@/src/hooks/contracts/useClaimsProcessorAddress";

describe("useClaimsProcessorAddress", () => {
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.sdk.registry.ClaimsProcessor.getAddress();

  test("while fetching w/o account and networkId", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));

    const { result } = await renderHookWrapper(useClaimsProcessorAddress);

    expect(result).toBeNull();
  });

  test("while fetching successful", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();

    const { result } = await renderHookWrapper(
      useClaimsProcessorAddress,
      [],
      true
    );

    expect(result).toBe(testData.claimsProcessorAddress);
  });
});
