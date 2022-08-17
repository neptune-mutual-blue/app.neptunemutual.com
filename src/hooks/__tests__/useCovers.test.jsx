import { useCovers } from "@/src/hooks/useCovers";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useCovers", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();
  mock();

  mockFn.useNetwork();

  test("should return default value when null data returned from api", async () => {
    mockFn.fetchSubgraph(true, null);
    const { result } = await renderHookWrapper(useCovers);
    expect(result.data).toEqual([]);
    expect(result.loading).toEqual(false);
  });

  // test("should return correct value as returned from the api", async () => {
  //   const mockData = [{ id: 1 }];
  //   mockFn.fetchSubgraph(true, { covers: mockData });

  //   const { result } = await renderHookWrapper(useCovers, [], true);
  //   expect(result.data).toEqual(mockData);
  // });

  test("should throw error when error returned from the api", async () => {
    mockFn.fetchSubgraph(false);

    await renderHookWrapper(useCovers);
    expect(mockFunction).toHaveBeenCalled();

    restore();
  });
});
