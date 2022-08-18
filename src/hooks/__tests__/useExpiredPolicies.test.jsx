import { useExpiredPolicies } from "@/src/hooks/useExpiredPolicies";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useExpiredPolicies", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();

  mockFn.useNetwork();
  mockFn.useWeb3React();
  mockFn.getGraphURL();

  test("should return default value when null data returned from api", async () => {
    const mockData = { data: null };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useExpiredPolicies);
    expect(result.data).toEqual({ expiredPolicies: [] });
    expect(result.loading).toEqual(false);

    mockFn.fetch().unmock();
  });

  test("should return result when data received from api", async () => {
    const mockData = {
      data: { userPolicies: [{ id: 1, policyName: "my-policy" }] },
    };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useExpiredPolicies, [], true);
    expect(result.data).toEqual({
      expiredPolicies: mockData.data.userPolicies,
    });
    expect(result.loading).toEqual(false);
  });

  test("should return if no account data available", async () => {
    mockFn.useWeb3React(() => ({ account: null }));

    const { result } = await renderHookWrapper(useExpiredPolicies, []);
    expect(result.data).toEqual({
      expiredPolicies: [],
    });

    mockFn.useWeb3React();
  });

  test("should log error if error occurs in api", async () => {
    mockFn.fetch(false);
    mock();

    const { result } = await renderHookWrapper(useExpiredPolicies, [], true);
    expect(result.data).toEqual({
      expiredPolicies: [],
    });
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });
});
