import { useCovers } from "@/src/hooks/useCovers";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useCovers", () => {
  const { mock, restore, mockFunction } = mockFn.console.error();
  mock();

  mockFn.useNetwork();
  mockFn.getGraphURL();

  test("should return default value when null data returned from api", async () => {
    const mockData = { data: null };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useCovers);
    expect(result.data).toEqual([]);
    expect(result.loading).toEqual(false);

    mockFn.fetch().unmock();
  });

  test("should return correct value as returned from the api", async () => {
    const mockData = { data: { covers: [{ id: 1 }] } };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useCovers, [], true);
    expect(result.data).toEqual(mockData.data.covers);
    mockFn.fetch().unmock();
  });

  test("should throw error when error returned from the api", async () => {
    mockFn.fetch(false);

    await renderHookWrapper(useCovers);
    expect(mockFunction).toHaveBeenCalled();

    restore();
    mockFn.fetch().unmock();
  });
});
