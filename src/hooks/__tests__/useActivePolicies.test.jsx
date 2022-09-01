import { useActivePolicies } from "../useActivePolicies";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockReturnData = {
  data: {
    userPolicies: [
      {
        totalAmountToCover: "1000",
      },
    ],
  },
};

describe("useActivePolicies", () => {
  const { mock, restore, mockFunction } = mockFn.console.error();

  mockFn.useNetwork();
  mockFn.getGraphURL();

  test("while fetching w/o account", async () => {
    mockFn.useWeb3React(() => ({ account: null }));

    const { result } = await renderHookWrapper(useActivePolicies);

    expect(result.data.activePolicies).toEqual([]);
    expect(result.data.totalActiveProtection.toString()).toEqual("0");
    expect(result.loading).toBe(false);
  });

  test("while fetching successful", async () => {
    mockFn.useWeb3React();
    mockFn.fetch(true, undefined, mockReturnData);

    const { result } = await renderHookWrapper(useActivePolicies, [], true);

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

    const { result } = await renderHookWrapper(useActivePolicies, [], true);

    expect(result.data.activePolicies).toEqual([]);
    expect(result.data.totalActiveProtection.toString()).toEqual("0");
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });
});
