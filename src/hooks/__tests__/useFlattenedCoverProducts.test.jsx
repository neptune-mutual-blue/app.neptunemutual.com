import { useFlattenedCoverProducts } from "@/src/hooks/useFlattenedCoverProducts";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useFlattenedCoverProducts", () => {
  const { mock, mockFunction, restore } = mockFn.console.error();
  mockFn.useNetwork();
  mockFn.getGraphURL();
  mockFn.getNetworkId();

  test("should return correct data ", async () => {
    mockFn.fetch();

    const { result } = await renderHookWrapper(useFlattenedCoverProducts, []);

    expect(result.data).toEqual([]);
    expect(result.loading).toBe(false);

    mockFn.fetch().unmock();
  });

  test("should return correct data as returned from api", async () => {
    const mockData = { data: { coverProducts: [{ id: 1 }, { id: 2 }] } };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(
      useFlattenedCoverProducts,
      [],
      true
    );

    expect(result.data).toEqual(mockData.data.coverProducts);

    mockFn.fetch().unmock();
  });

  test("should return empty array if no data returned from api", async () => {
    const mockData = { data: null };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(
      useFlattenedCoverProducts,
      [],
      true
    );

    expect(result.data).toEqual([]);

    mockFn.fetch().unmock();
  });

  test("should log error if api error", async () => {
    mockFn.fetch(false);
    mock();

    await renderHookWrapper(useFlattenedCoverProducts, [], true);

    expect(mockFunction).toHaveBeenCalled();

    restore();
    mockFn.fetch().unmock();
  });
});
