import { useDisputeIncident } from "@/src/hooks/useDisputeIncident";
import { convertToUnits } from "@/utils/bn";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useCreateBond", () => {
  const hookArgs = {
    coverKey:
      "0x6262382d65786368616e67650000000000000000000000000000000000000000",
    productKey:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    value: "100",
    incidentDate: "1660893112",
    minStake: "500000000000000",
  };

  mockFn.useNetwork();
  mockFn.useRouter();
  mockFn.useWeb3React();
  mockFn.useAppConstants();
  mockFn.useERC20Allowance();
  mockFn.useERC20Balance();
  mockFn.useTxToast();
  mockFn.useTxPoster();
  mockFn.useErrorNotifier();
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.sdk.registry.Governance.getInstance();
  mockFn.sdk.utils.ipfs.write();
  mockFn.useGovernanceAddress();
  mockFn.console.error().mock();

  test("should return default value from hook", async () => {
    const { result } = await renderHookWrapper(useDisputeIncident, [hookArgs]);

    expect(result.balance.toString()).toEqual(
      testData.erc20Balance.balance.toString()
    );
    expect(result.canDispute).toBe(false);
    expect(result.disputing).toBe(false);
  });

  test("should execute the handleApprove function", async () => {
    mockFn.useERC20Allowance(() => ({
      ...testData.erc20Allowance,
      allowance: convertToUnits(110),
    }));

    const { result, act } = await renderHookWrapper(
      useDisputeIncident,
      [hookArgs],
      false
    );

    await act(async () => {
      await result.handleApprove();
    });

    expect(result.canDispute).toBe(true);

    // mockFn.console.error().restore();
  });

  test("should execute the handleDispute function", async () => {
    const { result, act } = await renderHookWrapper(useDisputeIncident, [
      hookArgs,
    ]);

    await act(async () => {
      await result.handleDispute();
    });
  });

  describe("should simulate edge cases", () => {
    test("should return if no networkId", async () => {
      mockFn.useNetwork(() => ({
        networkId: null,
      }));

      const { result, act } = await renderHookWrapper(useDisputeIncident, [
        hookArgs,
      ]);

      await act(async () => {
        await result.handleDispute();
      });
    });

    test("should return if ipfs write returns no payload", async () => {
      mockFn.useNetwork();
      mockFn.sdk.utils.ipfs.write(true);

      const { result, act } = await renderHookWrapper(useDisputeIncident, [
        hookArgs,
      ]);

      await act(async () => {
        await result.handleDispute();
      });
    });

    test("should return error if error in writeContract", async () => {
      mockFn.sdk.utils.ipfs.write();
      mockFn.useTxPoster(() => ({
        ...testData.txPoster,
        writeContract: undefined,
      }));

      const { result, act } = await renderHookWrapper(useDisputeIncident, [
        hookArgs,
      ]);

      await act(async () => {
        await result.handleDispute();
      });
    });

    test("should return error in txtoast push function for handleApprove", async () => {
      mockFn.useTxPoster();
      mockFn.useTxToast(() => ({
        ...testData.txToast,
        push: jest.fn(() => Promise.reject({})),
      }));

      const { result, act } = await renderHookWrapper(useDisputeIncident, [
        hookArgs,
      ]);

      await act(async () => {
        await result.handleApprove();
      });
    });

    test("simulating edge cases for getInputError function", async () => {
      const args = [{ ...hookArgs, value: "" }];
      const { result, rerender } = await renderHookWrapper(useDisputeIncident, [
        args,
      ]);

      expect(result.canDispute).toBeUndefined();

      const args2 = [{ ...hookArgs, value: "1000000" }];
      rerender(args2);

      const args3 = [{ ...hookArgs, value: "0.0004" }];
      rerender(args3);

      mockFn.useERC20Balance(() => ({
        ...testData.erc20Balance,
        balance: convertToUnits(0.0004),
      }));
      const args4 = [{ ...hookArgs, value: "100" }];
      rerender(args4);

      // console.log({ r3 });
    });
  });
});
