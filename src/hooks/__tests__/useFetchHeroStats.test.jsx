import { useFetchHeroStats } from "@/src/hooks/useFetchHeroStats";
import { testData } from "@/utils/unit-tests/test-data";

import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useFetchHeroStats', () => {
  const { mock, mockFunction, restore } = mockFn.console.error()

  mockFn.getGraphURL()
  mockFn.getNetworkId()

  const mockFetchData = {
    data: {
      covers: [{}, {}, {}, {}],
      cxTokens: [
        { totalCoveredAmount: 12323 },
        { totalCoveredAmount: 7 },
        { totalCoveredAmount: 1000 }
      ],
      protocols: [
        {
          totalCoverLiquidityAdded: 1234,
          totalCoverLiquidityRemoved: 5434,
          totalFlashLoanFees: 124,
          totalCoverFee: 1023
        }
      ],
      reporting: [{}]
    }
  }

  test('should return correct data ', async () => {
    mockFn.fetch(true, undefined, mockFetchData)

    const { result } = await renderHookWrapper(useFetchHeroStats, [], true)

    expect(result.data.availableCovers).toBeDefined()
    expect(result.data.reportingCovers).toBeDefined()
    expect(result.data.coverFee).toBeDefined()
    expect(result.data.covered).toBeDefined()
    expect(result.data.tvlCover).toBeDefined()
    expect(result.data.tvlPool).toBeDefined()

    mockFn.fetch().unmock()
  })

  test('should log error if error returned from api', async () => {
    mockFn.fetch(false)
    mock()

    await renderHookWrapper(useFetchHeroStats, [], true)

    expect(mockFunction).toHaveBeenCalled()

    mockFn.fetch().unmock();
    restore();
  });

  test("Diversifed Cover ", async () => {
    mockFn.fetch(true, undefined, { data: testData.diversifedHeroStats });

    const { result } = await renderHookWrapper(
      useFetchHeroStats,
      [
        "0x6465666900000000000000000000000000000000000000000000000000000000",
        testData.appConstants.liquidityTokenDecimals,
      ],
      true
    );

    expect(result.data.availableCovers).toBeDefined();
    expect(result.data.reportingCovers).toBeDefined();
    expect(result.data.coverFee).toBeDefined();
    expect(result.data.covered).toBeDefined();
    expect(result.data.tvlCover).toBeDefined();
    expect(result.data.tvlPool).toBeDefined();

    mockFn.fetch().unmock();
  });

  test("Diversifed Cover Error", async () => {
    mockFn.fetch(false, undefined, { data: testData.diversifedHeroStats });

    const { result } = await renderHookWrapper(
      useFetchHeroStats,
      [
        "0x6465666900000000000000000000000000000000000000000000000000000000",
        testData.appConstants.liquidityTokenDecimals,
      ],
      true
    );

    expect(result.data.availableCovers).toEqual(0);
    expect(result.data.reportingCovers).toEqual(0);
    expect(result.data.coverFee).toEqual("0");
    expect(result.data.covered).toEqual("0");
    expect(result.data.tvlCover).toEqual("0");
    expect(result.data.tvlPool).toEqual("0");

    mockFn.fetch().unmock();
  });
});
