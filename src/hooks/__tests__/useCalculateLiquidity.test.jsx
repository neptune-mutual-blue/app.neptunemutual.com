import { useCalculateLiquidity } from "../useCalculateLiquidity";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  podAmount: 1000,
};

const mockReturnData = {
  receiveAmount: "0",
  loading: false,
};

describe("useCalculateLiquidity", () => {
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.sdk.registry.Vault.getInstance();
  mockFn.useErrorNotifier();

  test("while fetching w/o networkId, account, debouncedValue", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.useDebounce(null);

    const { result } = await renderHookWrapper(useCalculateLiquidity, [
      mockProps,
    ]);

    expect(result.receiveAmount).toEqual(mockReturnData.receiveAmount);
    expect(result.loading).toEqual(mockReturnData.loading);
  });

  test("while fetching successful ", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useDebounce();
    mockFn.useTxPoster();

    const { result } = await renderHookWrapper(
      useCalculateLiquidity,
      [mockProps],
      true
    );

    const amount = await (await testData.txPoster.contractRead()).toString();

    expect(result.receiveAmount.toString()).toEqual(amount);
  });

  test("while fetching is not mounted ", async () => {
    mockFn.useMountedState();
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useDebounce();
    mockFn.useTxPoster();

    const { result } = await renderHookWrapper(
      useCalculateLiquidity,
      [mockProps],
      true
    );

    expect(result.receiveAmount).toEqual(mockReturnData.receiveAmount);
    expect(result.loading).toEqual(mockReturnData.loading);
  });

  test("while fetching error ", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useDebounce();
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      contractRead: undefined,
    }));

    const { result } = await renderHookWrapper(
      useCalculateLiquidity,
      [mockProps],
      true
    );

    expect(result.receiveAmount).toEqual(mockReturnData.receiveAmount);
    expect(result.loading).toEqual(mockReturnData.loading);
  });
});
