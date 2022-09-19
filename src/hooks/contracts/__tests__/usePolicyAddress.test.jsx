import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { usePolicyAddress } from "@/src/hooks/contracts/usePolicyAddress";

describe("useClaimsProcessorAddress", () => {
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.sdk.registry.PolicyContract.getAddress();

  test("while fetching w/o account and networkId", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));

    const { result } = await renderHookWrapper(usePolicyAddress);

    expect(result).toBeNull();
  });

  test("while fetching successful", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();

    const { result } = await renderHookWrapper(usePolicyAddress, [], true);

    expect(result).toBe("PolicyContract getAddress() mock");
  });
});
