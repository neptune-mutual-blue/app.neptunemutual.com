import { useCalculatePods } from "../useCalculatePods";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";
import { convertToUnits } from "@/utils/bn";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  value: 100,
  podAddress: "0xBD85714f56622BDec5599BA965E60d01d4943540",
};

describe("useCalculatePods", () => {
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.sdk.registry.Vault.getInstance();
  mockFn.useErrorNotifier();

  test("while fetching w/o networkId, account, debouncedValue", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.useDebounce(null);

    const { result } = await renderHookWrapper(useCalculatePods, [mockProps]);

    expect(result.receiveAmount).toEqual("0");
    expect(result.loading).toBe(false);
  });

  test("while fetching successful ", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useDebounce();
    mockFn.useTxPoster();
    mockFn.useTokenDecimals();

    const { result } = await renderHookWrapper(
      useCalculatePods,
      [mockProps],
      true
    );

    const amount = await (await testData.txPoster.contractRead()).toString();

    expect(convertToUnits(result.receiveAmount).toString()).toEqual(amount);
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
      useCalculatePods,
      [mockProps],
      true
    );

    expect(result.receiveAmount).toEqual("0");
    expect(result.loading).toBe(false);
  });
});
