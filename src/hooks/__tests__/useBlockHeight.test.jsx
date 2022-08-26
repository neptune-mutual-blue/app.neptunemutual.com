import { useBlockHeight } from "../useBlockHeight";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";

describe("useBlockHeight", () => {
  test("should not receive block height", async () => {
    mockFn.useWeb3React(() => ({
      account: null,
    }));
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.utilsWeb3.getProviderOrSigner(() => null);

    const { result } = await renderHookWrapper(useBlockHeight);

    expect(result).toEqual(1);
  });

  test("should receive block height", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.utilsWeb3.getProviderOrSigner(
      () => testData.providerOrSignerGetBlockNumber
    );

    const { result } = await renderHookWrapper(useBlockHeight, [], true);

    expect(result).toEqual(100);
  });
});
