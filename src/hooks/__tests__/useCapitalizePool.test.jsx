import { useCapitalizePool } from "../useCapitalizePool";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x62616c616e636572000000000000000000000000000000000000000000000000",
  incidentDate: "",
};

describe("useCapitalizePool", () => {
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.sdk.registry.Reassurance.getInstance();
  mockFn.useErrorNotifier();

  test("while fetching w/o account and networkId", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.useAuthValidation();

    const { result, act } = await renderHookWrapper(useCapitalizePool, [
      mockProps,
    ]);

    await act(async () => {
      await result.capitalize();
    });

    expect(result.capitalize).toEqual(expect.any(Function));
    expect(result.capitalizing).toBe(false);
  });

  test("while fetching successful", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useTxPoster();
    mockFn.useTxToast();

    const { result, act } = await renderHookWrapper(
      useCapitalizePool,
      [mockProps],
      false
    );

    await act(async () => {
      await result.capitalize();
    });

    expect(result.capitalize).toEqual(expect.any(Function));
    expect(result.capitalizing).toBe(false);
  });

  test("while fetching error", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined,
    }));
    mockFn.useTxToast();

    const { result, act } = await renderHookWrapper(
      useCapitalizePool,
      [mockProps],
      false
    );

    await act(async () => {
      await result.capitalize();
    });

    expect(result.capitalize).toEqual(expect.any(Function));
    expect(result.capitalizing).toBe(false);
  });
});
