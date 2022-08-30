import { useClaimBond } from "../useClaimBond";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";

describe("useClaimBond", () => {
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.sdk.registry.BondPool.getInstance();
  mockFn.useErrorNotifier();
  mockFn.useAppConstants();

  test("while fetching w/o account and networkId", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));

    const { result, act } = await renderHookWrapper(useClaimBond);

    await act(async () => {
      await result.handleClaim(() => {});
    });

    expect(result.handleClaim).toEqual(expect.any(Function));
    expect(result.claiming).toBe(false);
  });

  test("while fetching successful", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useTxPoster();
    mockFn.useTxToast();

    const { result, act } = await renderHookWrapper(useClaimBond);

    await act(async () => {
      await result.handleClaim(() => {});
    });

    expect(result.handleClaim).toEqual(expect.any(Function));
    expect(result.claiming).toBe(false);
  });

  test("while fetching error", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined,
    }));
    mockFn.useTxToast();

    const { result, act } = await renderHookWrapper(useClaimBond);

    await act(async () => {
      await result.handleClaim(() => {});
    });

    expect(result.handleClaim).toEqual(expect.any(Function));
    expect(result.claiming).toBe(false);
  });
});
