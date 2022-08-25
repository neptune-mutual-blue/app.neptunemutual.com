import {
  defaultInfo,
  useMyLiquidityInfo,
} from "@/src/hooks/useMyLiquidityInfo";
import { testData } from "@/utils/unit-tests/test-data";

import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const assertInfo = (result, matchData, defaultInfo = false) => {
  expect(result.info.withdrawalOpen).toEqual(
    defaultInfo ? matchData.withdrawalOpen : matchData.withdrawalStarts
  );
  expect(result.info.withdrawalClose).toEqual(
    defaultInfo ? matchData.withdrawalClose : matchData.withdrawalEnds
  );
  expect(result.info.totalReassurance).toEqual(
    defaultInfo ? matchData.totalReassurance : matchData.totalReassurance
  );
  expect(result.info.vault).toEqual(
    defaultInfo ? matchData.vault : matchData.vault
  );
  expect(result.info.stablecoin).toEqual(
    defaultInfo ? matchData.stablecoin : matchData.stablecoin
  );
  expect(result.info.podTotalSupply).toEqual(
    defaultInfo ? matchData.podTotalSupply : matchData.podTotalSupply
  );
  expect(result.info.myPodBalance).toEqual(
    defaultInfo ? matchData.myPodBalance : matchData.myPodBalance
  );
  expect(result.info.vaultStablecoinBalance).toEqual(
    defaultInfo
      ? matchData.vaultStablecoinBalance
      : matchData.vaultStablecoinBalance
  );
  expect(result.info.amountLentInStrategies).toEqual(
    defaultInfo
      ? matchData.amountLentInStrategies
      : matchData.amountLentInStrategies
  );
  expect(result.info.myShare).toEqual(
    defaultInfo ? matchData.myShare : matchData.myShare
  );
  expect(result.info.myUnrealizedShare).toEqual(
    defaultInfo ? matchData.myUnrealizedShare : matchData.myUnrealizedShare
  );
  expect(result.info.totalLiquidity).toEqual(
    defaultInfo ? matchData.totalLiquidity : matchData.totalLiquidity
  );
  expect(result.info.myStablecoinBalance).toEqual(
    defaultInfo ? matchData.myStablecoinBalance : matchData.myStablecoinBalance
  );
  expect(result.info.stablecoinTokenSymbol).toEqual(
    defaultInfo
      ? matchData.stablecoinTokenSymbol
      : matchData.stablecoinTokenSymbol
  );
  expect(result.info.vaultTokenDecimals).toEqual(
    defaultInfo ? matchData.vaultTokenDecimals : matchData.vaultTokenDecimals
  );
  expect(result.info.vaultTokenSymbol).toEqual(
    defaultInfo ? matchData.vaultTokenSymbol : matchData.vaultTokenSymbol
  );
  expect(result.info.minStakeToAddLiquidity).toEqual(
    defaultInfo
      ? matchData.minStakeToAddLiquidity
      : matchData.minStakeToAddLiquidity
  );
  expect(result.info.myStake).toEqual(
    defaultInfo ? matchData.myStake : matchData.myStake
  );
  expect(result.info.isAccrualComplete).toEqual(
    defaultInfo ? matchData.isAccrualComplete : matchData.isAccrualComplete
  );
};

describe("useMyLiquidityInfo", () => {
  mockFn.useWeb3React();
  mockFn.useNetwork();
  mockFn.useTxToast();
  mockFn.useTxPoster();
  mockFn.useErrorNotifier();
  mockFn.getGraphURL();
  mockFn.getInfo();
  mockFn.sdk.registry.Vault.getInstance();

  const args = [
    {
      coverKey:
        "0x7072696d65000000000000000000000000000000000000000000000000000000",
    },
  ];

  test("should return data from getInfo function if account connected ", async () => {
    const { result } = await renderHookWrapper(useMyLiquidityInfo, args, true);

    assertInfo(result, testData.myLiquidityInfo);
    expect(result.isWithdrawalWindowOpen).toEqual(false);
    expect(typeof result.accrueInterest).toEqual("function");
    expect(typeof result.refetch).toEqual("function");
  });

  test("should get info from api if account not available", async () => {
    const mockData = { data: testData.myLiquidityInfo };
    mockFn.fetch(true, undefined, mockData);
    mockFn.useWeb3React(() => ({ account: null }));

    const { result } = await renderHookWrapper(useMyLiquidityInfo, args, true);
    assertInfo(result, mockData.data);

    mockFn.fetch().unmock();
    mockFn.useWeb3React();
  });

  test("should be able to execute the refetch function", async () => {
    const { result, act } = await renderHookWrapper(useMyLiquidityInfo, args);

    await act(async () => {
      await result.refetch();
    });
  });

  test("should be able to execute the accrueInterest function", async () => {
    const { result, act } = await renderHookWrapper(useMyLiquidityInfo, args);

    await act(async () => {
      await result.accrueInterest();
    });
  });

  describe("Edge cases coverage", () => {
    test("should return default value if no networkId or coverKey", async () => {
      mockFn.useNetwork(() => ({ networkId: null }));

      const { result } = await renderHookWrapper(useMyLiquidityInfo, args);
      assertInfo(result, defaultInfo, true);

      mockFn.useNetwork();
    });

    test("should return default value if bad response from api", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(true, { ...testData.fetch, ok: false });

      const { result } = await renderHookWrapper(useMyLiquidityInfo, args);
      assertInfo(result, defaultInfo, true);

      mockFn.useWeb3React();
      mockFn.fetch().unmock();
    });

    test("should return default value if no data from api", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(true, undefined, { data: null });

      const { result } = await renderHookWrapper(useMyLiquidityInfo, args);
      assertInfo(result, defaultInfo, true);

      mockFn.fetch().unmock();
      mockFn.useWeb3React();
    });

    test("should call notifyError when error is raised", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(false);

      await renderHookWrapper(useMyLiquidityInfo, args);
      expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

      mockFn.fetch().unmock();
      mockFn.useWeb3React();
    });

    test("should return default value if no data from api when refetch function called", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(true, undefined, { data: null });

      const { result, act, renderHookResult } = await renderHookWrapper(
        useMyLiquidityInfo,
        args
      );

      await act(async () => {
        await result.refetch();
      });
      assertInfo(renderHookResult.current, defaultInfo, true);

      mockFn.fetch().unmock();
      mockFn.useWeb3React();
    });

    test("should call notifyError when error is raised during accrueInterest", async () => {
      mockFn.useTxPoster(() => ({ ...testData.txPoster, writeContract: null }));

      const { result, act } = await renderHookWrapper(useMyLiquidityInfo, args);
      await act(async () => {
        await result.accrueInterest();
      });

      expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

      mockFn.useTxPoster();
    });
  });
});
