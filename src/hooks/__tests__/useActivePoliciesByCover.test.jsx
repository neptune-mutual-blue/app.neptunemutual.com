import { useActivePoliciesByCover } from "../useActivePoliciesByCover";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x62616c616e636572000000000000000000000000000000000000000000000000",
  page: 1,
  limit: 50,
};

const mockReturnData = {
  data: {
    userPolicies: [
      {
        totalAmountToCover: "1000",
      },
    ],
  },
};

describe("useActivePoliciesByCover", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();

  test("while fetching w/o account, networkId and graphURL", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.getGraphURL(() => "");

    const { result } = await renderHookWrapper(useActivePoliciesByCover, [
      mockProps,
    ]);

    expect(result.data.activePolicies).toEqual([]);
    expect(result.data.totalActiveProtection.toString()).toEqual("0");
    expect(result.loading).toBe(false);
    expect(result.hasMore).toBe(true);
  });

  test("while fetching successful", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.getGraphURL();
    mockFn.fetch(true, undefined, mockReturnData);

    const { result } = await renderHookWrapper(
      useActivePoliciesByCover,
      [mockProps],
      true
    );

    expect(result.data.activePolicies).toEqual([
      ...mockReturnData.data.userPolicies,
    ]);
    expect(result.data.totalActiveProtection.toString()).toEqual(
      mockReturnData.data.userPolicies[0].totalAmountToCover
    );
  });

  test("while fetching error", async () => {
    mockFn.fetch(false);
    mock();

    const { result } = await renderHookWrapper(
      useActivePoliciesByCover,
      [mockProps],
      true
    );

    expect(result.data.activePolicies).toEqual([]);
    expect(result.data.totalActiveProtection.toString()).toEqual("0");
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });
});
