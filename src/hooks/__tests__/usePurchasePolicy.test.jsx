import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";
import { usePurchasePolicy } from "@/src/hooks/usePurchasePolicy";
import { convertToUnits } from "@/utils/bn";

const mockArgs = {
  coverKey:
    "0x6262382d65786368616e67650000000000000000000000000000000000000000",
  productKey:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  value: "100",
  feeAmount: "9698630",
  coverMonth: "2",
  availableLiquidity: "3791617.978",
  liquidityTokenSymbol: "DAI",
  referralCode: "",
};

describe("usePurchasePolicy", () => {
  mockFn.useWeb3React();
  mockFn.useNetwork();
  mockFn.usePolicyAddress();
  mockFn.useAppConstants();
  mockFn.useERC20Balance();
  mockFn.useERC20Allowance();
  mockFn.useRouter();
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.useLiquidityFormsContext();
  mockFn.useTxToast();
  mockFn.useTxPoster();
  mockFn.useErrorNotifier();
  mockFn.sdk.registry.PolicyContract.getInstance();

  test("should return default value from hook", async () => {
    const { result } = await renderHookWrapper(usePurchasePolicy, [mockArgs]);

    expect(result.balance.toString()).toEqual(
      testData.erc20Balance.balance.toString()
    );
  });

  test("calling handleApprove function", async () => {
    mockFn.useERC20Allowance(() => ({
      ...testData.erc20Allowance,
      allowance: convertToUnits(mockArgs.value),
    }));

    const { result, act } = await renderHookWrapper(usePurchasePolicy, [
      mockArgs,
    ]);

    await act(async () => {
      await result.handleApprove();
    });

    await (await testData.txPoster.contractRead()).toString();
    expect(result.allowance).toEqual(convertToUnits(mockArgs.value));
    expect(result.canPurchase).toBe(true);
  });

  test("calling handlePurchase function", async () => {
    mockFn.useTxToast();
    const { result, act } = await renderHookWrapper(usePurchasePolicy, [
      mockArgs,
    ]);

    await act(async () => {
      await result.handlePurchase(jest.fn());
    });
  });

  test("calling handlePurchase function with error", async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined,
    }));
    const { result, act } = await renderHookWrapper(usePurchasePolicy, [
      mockArgs,
    ]);

    await act(async () => {
      await result.handlePurchase(jest.fn());
    });
  });

  test("simulating for coverage", async () => {
    mockFn.console.error().mock();
    let args = { ...mockArgs, value: "invalid" };
    const { result, rerender } = await renderHookWrapper(
      usePurchasePolicy,
      [args],
      true
    );
    expect(result.error).toBe("Invalid amount to cover");

    args = { ...mockArgs, value: "" };
    await rerender([args]);

    args = { ...mockArgs, value: "1001" };
    await rerender([args]);

    args = { ...mockArgs, value: "0" };
    await rerender([args]);

    args = { ...mockArgs, value: "3791620" };
    await rerender([args]);

    args = { ...mockArgs, feeAmount: convertToUnits(1100) };
    await rerender([args]);

    mockFn.useNetwork();

    await rerender([args]);

    mockFn.console.error().restore();
  });
});
