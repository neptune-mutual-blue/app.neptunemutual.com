import { CoverStatus } from "@/src/config/constants";
import {
  defaultStats,
  useFetchCoverStats,
} from "@/src/hooks/useFetchCoverStats";
import { testData } from "@/utils/unit-tests/test-data";

import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const checkData = (result, matchWithData = true) => {
  if (matchWithData) {
    expect(result.info.activeIncidentDate).toEqual(
      testData.getcoverStats.activeIncidentDate
    );
    expect(result.info.claimPlatformFee).toEqual(
      testData.getcoverStats.claimPlatformFee
    );
    expect(result.info.activeCommitment).toEqual(
      testData.getcoverStats.activeCommitment
    );
    expect(result.info.isUserWhitelisted).toEqual(
      testData.getcoverStats.isUserWhitelisted
    );
    expect(result.info.productStatus).toEqual(
      CoverStatus[testData.getcoverStats.productStatus]
    );
    expect(result.info.reporterCommission).toEqual(
      testData.getcoverStats.reporterCommission
    );
    expect(result.info.reportingPeriod).toEqual(
      testData.getcoverStats.reportingPeriod
    );
    expect(result.info.totalPoolAmount).toEqual(
      testData.getcoverStats.totalPoolAmount
    );
    expect(result.info.requiresWhitelist).toEqual(
      testData.getcoverStats.requiresWhitelist
    );
    expect(result.info.availableLiquidity).toEqual(
      testData.getcoverStats.availableLiquidity
    );
    expect(result.info.minReportingStake).toEqual(
      testData.getcoverStats.minReportingStake
    );
  } else {
    expect(result.info.activeIncidentDate).toEqual(
      defaultStats.activeIncidentDate
    );
    expect(result.info.claimPlatformFee).toEqual(defaultStats.claimPlatformFee);
    expect(result.info.activeCommitment).toEqual(defaultStats.activeCommitment);
    expect(result.info.isUserWhitelisted).toEqual(
      defaultStats.isUserWhitelisted
    );
    expect(result.info.reporterCommission).toEqual(
      defaultStats.reporterCommission
    );
    expect(result.info.reportingPeriod).toEqual(defaultStats.reportingPeriod);
    expect(result.info.totalPoolAmount).toEqual(defaultStats.totalPoolAmount);
    expect(result.info.requiresWhitelist).toEqual(
      defaultStats.requiresWhitelist
    );
    expect(result.info.availableLiquidity).toEqual(
      defaultStats.availableLiquidity
    );
    expect(result.info.minReportingStake).toEqual(
      defaultStats.minReportingStake
    );
  }
};

describe("useFetchCoverStats", () => {
  const { mock, mockFunction, restore } = mockFn.console.error();

  mockFn.useNetwork();
  mockFn.useWeb3React();
  mockFn.getStats();

  const args = [
    {
      coverKey:
        "0x7072696d65000000000000000000000000000000000000000000000000000000",
      productKey:
        "0x6161766500000000000000000000000000000000000000000000000000000000",
    },
  ];

  test("should return data from the geStats function if account available", async () => {
    const mockData = { data: {} };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useFetchCoverStats, args, true);

    expect(typeof result.refetch).toBe("function");
    checkData(result);

    mockFn.fetch().unmock();
  });

  test("should return data from api if account not available", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    const mockData = { data: testData.getcoverStats };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useFetchCoverStats, args, true);
    checkData(result);

    mockFn.fetch().unmock();
    mockFn.useWeb3React();
  });

  test("should set data from default value if no data available from api", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    const mockData = { data: { activeIncidentDate: "" } };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useFetchCoverStats, args, true);
    checkData(result, false);

    mockFn.fetch().unmock();
    mockFn.useWeb3React();
  });

  test("should call the refetch function", async () => {
    const { result, act } = await renderHookWrapper(
      useFetchCoverStats,
      args,
      true
    );

    await act(async () => {
      await result.refetch();
    });
  });

  describe("Edge cases coverage", () => {
    test("should return if no networkId found", async () => {
      mockFn.useNetwork(() => ({ networkId: null }));

      await renderHookWrapper(useFetchCoverStats, args);

      mockFn.useNetwork();
    });

    test("should return if response not ok from api", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(true, { ...testData.fetch, ok: false });

      await renderHookWrapper(useFetchCoverStats, args);

      mockFn.fetch().unmock();
      mockFn.useWeb3React();
    });

    test("should return if null data from api", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(true, undefined, { data: null });

      await renderHookWrapper(useFetchCoverStats, args);

      mockFn.fetch().unmock();
      mockFn.useWeb3React();
    });

    test("should return if error returned from api", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(false);
      mock();

      await renderHookWrapper(useFetchCoverStats, args);
      expect(mockFunction).toHaveBeenCalled();

      mockFn.fetch().unmock();
      mockFn.useWeb3React();
      restore();
    });

    test("should return if no networkId when refetch", async () => {
      mockFn.useNetwork(() => ({ networkId: null }));

      const { act, result } = await renderHookWrapper(useFetchCoverStats, args);

      await act(async () => {
        await result.refetch();
      });

      mockFn.useNetwork();
    });

    test("should return defaultvalue if no data from api when refetch", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(true, undefined, { data: { id: 1 } });

      const { result, act } = await renderHookWrapper(useFetchCoverStats, args);

      await act(async () => {
        await result.refetch();
      });
      checkData(result, false);

      mockFn.useNetwork();
    });

    test("should return if error returned from api for refetch", async () => {
      mockFn.useWeb3React(() => ({ account: null }));
      mockFn.fetch(false);
      mock();

      const { result, act } = await renderHookWrapper(useFetchCoverStats, args);

      await act(async () => {
        await result.refetch();
      });
      expect(mockFunction).toHaveBeenCalled();

      mockFn.fetch().unmock();
      mockFn.useWeb3React();
      restore();
    });
  });
});
