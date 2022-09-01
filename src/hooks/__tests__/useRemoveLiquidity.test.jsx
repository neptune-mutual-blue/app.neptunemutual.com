import { useRemoveLiquidity } from "@/src/hooks/useRemoveLiquidity";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useRemoveLiquidity", () => {
  mockFn.useWeb3React();
  mockFn.useNetwork();
  mockFn.useLiquidityFormsContext();
  mockFn.useERC20Allowance();
  mockFn.useTxToast();
  mockFn.useErrorNotifier();
  mockFn.useTxPoster();
  mockFn.sdk.registry.Vault.getInstance();

  const args = [
    {
      coverKey:
        "0x7072696d65000000000000000000000000000000000000000000000000000000",
      value: "100",
      npmValue: "1000",
    },
  ];

  test("should return default hook result", async () => {
    const { result } = await renderHookWrapper(useRemoveLiquidity, args);

    expect(result.allowance.toString()).toEqual(
      testData.erc20Allowance.allowance.toString()
    );
    expect(result.loadingAllowance).toEqual(false);
    expect(result.approving).toEqual(false);
    expect(result.withdrawing).toEqual(false);
    expect(typeof result.handleApprove).toEqual("function");
    expect(typeof result.handleWithdraw).toEqual("function");
  });

  test("should execute handleApprove function", async () => {
    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args);

    await act(async () => {
      await result.handleApprove();
    });

    expect(testData.erc20Allowance.approve).toHaveBeenCalled();
  });

  test("should execute handleWithdraw function", async () => {
    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args);

    const successCb = jest.fn();
    await act(async () => {
      await result.handleWithdraw(successCb, true);
    });

    expect(successCb).toHaveBeenCalled();
    expect(testData.txPoster.writeContract).toHaveBeenCalled();
  });

  test("should call notifyError when error arises in handleApprove", async () => {
    mockFn.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject("Error")),
    }));

    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args);

    await act(async () => {
      await result.handleApprove();
    });
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

    mockFn.useTxToast();
  });

  test("should return when no networkId or account in handleWithdraw", async () => {
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.useWeb3React(() => ({ account: null }));

    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args);

    const successCb = jest.fn();
    await act(async () => {
      await result.handleWithdraw(successCb, true);
    });

    mockFn.useNetwork();
    mockFn.useWeb3React();
  });

  test("should call notifyError when error in handleWithdraw", async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null,
    }));

    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args);

    const successCb = jest.fn();
    await act(async () => {
      await result.handleWithdraw(successCb, true);
    });

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled();
    mockFn.useTxPoster();
  });
});
