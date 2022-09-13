import { useVote } from "@/src/hooks/useVote";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useVote", () => {
  mockFn.useWeb3React();
  mockFn.useNetwork();
  mockFn.useTxToast();
  mockFn.useAppConstants();
  mockFn.useGovernanceAddress();
  mockFn.useTxPoster();
  mockFn.useERC20Allowance();
  mockFn.useERC20Balance();
  mockFn.useErrorNotifier();
  mockFn.sdk.registry.Governance.getInstance();

  const args = [
    {
      coverKey:
        "0x6262382d65786368616e67650000000000000000000000000000000000000000",
      productKey:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      value: "100",
      incidentDate: "1662551282",
    },
  ];

  test("should return correct data from hook", async () => {
    const { result } = await renderHookWrapper(useVote, args);

    expect(result.tokenAddress).toEqual(testData.appConstants.NPMTokenAddress);
    expect(result.tokenSymbol).toEqual(testData.appConstants.NPMTokenSymbol);
    expect(result.balance.toString()).toEqual(
      testData.erc20Balance.balance.toString()
    );

    expect(result.approving).toEqual(false);
    expect(result.voting).toEqual(false);
    expect(result.loadingAllowance).toEqual(false);
    expect(result.loadingBalance).toEqual(false);
    expect(result.canVote).toEqual(false);
    expect(result.isError).toEqual(false);

    expect(typeof result.handleApprove).toEqual("function");
    expect(typeof result.handleAttest).toEqual("function");
    expect(typeof result.handleRefute).toEqual("function");
  });

  describe("handleApprove", () => {
    test("should be able to execute the function", async () => {
      const { result, act } = await renderHookWrapper(useVote, args);

      await act(async () => {
        await result.handleApprove();
      });
    });

    test("should handle error if error raised inside onTransactionResult", async () => {
      const mockedFn = jest.fn().mockRejectedValue("error");
      mockFn.useTxToast(() => ({
        ...testData.txToast,
        push: mockedFn,
      }));

      const { result, act } = await renderHookWrapper(useVote, args);
      await act(async () => {
        await result.handleApprove();
      });
      expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

      mockFn.useTxToast();
    });
  });

  describe("handleAttest", () => {
    test("should be able to execute the function", async () => {
      const { result, act } = await renderHookWrapper(useVote, args);

      await act(async () => {
        const onTxSuccess = jest.fn();
        await result.handleAttest(onTxSuccess);
        expect(onTxSuccess).toHaveBeenCalled();
      });
    });

    test("should handle error if error raised", async () => {
      mockFn.useTxPoster(() => ({
        ...testData.txPoster,
        writeContract: null,
      }));

      const { result, act } = await renderHookWrapper(useVote, [
        { ...args[0], productKey: "" },
      ]);

      await act(async () => {
        const onTxSuccess = jest.fn();
        await result.handleAttest(onTxSuccess);
      });
      expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

      mockFn.useTxPoster();
    });
  });

  describe("handleRefute", () => {
    test("should be able to execute the function", async () => {
      const { result, act } = await renderHookWrapper(useVote, args);

      await act(async () => {
        await result.handleRefute();
      });
    });

    test("should handle error if error raised", async () => {
      mockFn.useTxPoster(() => ({
        ...testData.txPoster,
        writeContract: null,
      }));

      const { result, act } = await renderHookWrapper(useVote, [
        { ...args[0], productKey: "" },
      ]);

      await act(async () => {
        await result.handleRefute();
      });
      expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

      mockFn.useTxPoster();
    });
  });
});
