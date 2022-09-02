import { useProtocolDayData } from "@/src/hooks/useProtocolDayData";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockReturnData = {
  data: {
    protocolDayDatas: [
      {
        date: 1658102400,
        totalLiquidity: "61432804000000",
      },
      {
        date: 1658188800,
        totalLiquidity: "61432804000000",
      },
      {
        date: 1658275200,
        totalLiquidity: "61434054000000",
      },
      {
        date: 1658361600,
        totalLiquidity: "61442554000000",
      },
      {
        date: 1658448000,
        totalLiquidity: "61447554000000",
      },
      {
        date: 1658534400,
        totalLiquidity: "61447554000000",
      },
      {
        date: 1658620800,
        totalLiquidity: "61447554000000",
      },
      {
        date: 1658707200,
        totalLiquidity: "61449554000000",
      },
      {
        date: 1658793600,
        totalLiquidity: "61469047602741",
      },
      {
        date: 1658880000,
        totalLiquidity: "61483097602741",
      },
      {
        date: 1658966400,
        totalLiquidity: "61483097602741",
      },
      {
        date: 1659052800,
        totalLiquidity: "61483597602741",
      },
      {
        date: 1659139200,
        totalLiquidity: "61483597602741",
      },
      {
        date: 1659225600,
        totalLiquidity: "61483697602741",
      },
      {
        date: 1659312000,
        totalLiquidity: "61483697602741",
      },
      {
        date: 1659398400,
        totalLiquidity: "61483697602741",
      },
      {
        date: 1659484800,
        totalLiquidity: "61483697602741",
      },
      {
        date: 1659571200,
        totalLiquidity: "61488419602741",
      },
      {
        date: 1659657600,
        totalLiquidity: "61489419602741",
      },
      {
        date: 1659744000,
        totalLiquidity: "61489419602741",
      },
      {
        date: 1659830400,
        totalLiquidity: "61489419602741",
      },
      {
        date: 1659916800,
        totalLiquidity: "61489519602741",
      },
      {
        date: 1660003200,
        totalLiquidity: "61489609602741",
      },
      {
        date: 1660089600,
        totalLiquidity: "61489609602741",
      },
      {
        date: 1660176000,
        totalLiquidity: "61509609602741",
      },
      {
        date: 1660262400,
        totalLiquidity: "61509609602741",
      },
      {
        date: 1660348800,
        totalLiquidity: "61509609602741",
      },
      {
        date: 1660435200,
        totalLiquidity: "61509609602741",
      },
      {
        date: 1660521600,
        totalLiquidity: "61509609602741",
      },
      {
        date: 1660608000,
        totalLiquidity: "61509609602741",
      },
      {
        date: 1660694400,
        totalLiquidity: "61510498602741",
      },
      {
        date: 1660780800,
        totalLiquidity: "61510498602741",
      },
      {
        date: 1660867200,
        totalLiquidity: "61510498602741",
      },
      {
        date: 1660953600,
        totalLiquidity: "61520498602741",
      },
      {
        date: 1661040000,
        totalLiquidity: "61520498602741",
      },
      {
        date: 1661126400,
        totalLiquidity: "61520498602741",
      },
      {
        date: 1661212800,
        totalLiquidity: "61521498602741",
      },
      {
        date: 1661299200,
        totalLiquidity: "61523698602741",
      },
      {
        date: 1661385600,
        totalLiquidity: "61523698602741",
      },
      {
        date: 1661472000,
        totalLiquidity: "61523698602741",
      },
      {
        date: 1661558400,
        totalLiquidity: "61523698602741",
      },
      {
        date: 1661644800,
        totalLiquidity: "61523898602741",
      },
      {
        date: 1661731200,
        totalLiquidity: "61523998602741",
      },
      {
        date: 1661817600,
        totalLiquidity: "61524998602741",
      },
      {
        date: 1661904000,
        totalLiquidity: "61524998602741",
      },
      {
        date: 1661990400,
        totalLiquidity: "61524998602741",
      },
    ],
  },
  loading: false,
};

describe("useProtocolDayData", () => {
  const { mock, mockFunction, restore } = mockFn.consoleError();
  mockFn.useWeb3React();
  mockFn.useNetwork();
  mockFn.getGraphURL();

  test("should return correct data", async () => {
    mockFn.fetch(true, undefined, mockReturnData);
    const { result } = await renderHookWrapper(useProtocolDayData, [], true);

    expect(result.loading).toBeFalsy();
    expect(result.data.length).toBe(
      mockReturnData.data.protocolDayDatas.length
    );
  });

  test("should log error in case of api error", async () => {
    mockFn.fetch(false);
    mock();

    await renderHookWrapper(useProtocolDayData);

    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });
});
