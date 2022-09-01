import { useActiveReportings } from "../useActiveReportings";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockReturnData = {
  data: {
    incidentReports: [
      {
        id: "x09319hdakn12313",
      },
    ],
  },
};

describe("useActiveReportings", () => {
  const { mock, restore, mockFunction } = mockFn.console.error();

  mockFn.useNetwork();
  mockFn.getGraphURL();

  test("while fetching successful", async () => {
    mockFn.fetch(true, undefined, mockReturnData);

    const { result } = await renderHookWrapper(useActiveReportings, [], true);

    expect(result.data.incidentReports).toEqual([
      ...mockReturnData.data.incidentReports,
    ]);
    expect(result.handleShowMore).toEqual(expect.any(Function));
    expect(result.loading).toBe(false);
    expect(result.hasMore).toBe(false);
  });

  test("while fetching error", async () => {
    mockFn.fetch(false);
    mock();

    const { result } = await renderHookWrapper(useActiveReportings, [], true);

    expect(result.data.incidentReports).toEqual([]);
    expect(result.handleShowMore).toEqual(expect.any(Function));
    expect(result.loading).toBe(false);
    expect(result.hasMore).toBe(true);
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });

  test("calling handleShowMore function", async () => {
    mockFn.fetch(true, undefined, mockReturnData);

    const { result, act } = await renderHookWrapper(
      useActiveReportings,
      [],
      true
    );

    await act(async () => {
      await result.handleShowMore();
    });

    expect(result.data.incidentReports).toEqual([
      ...mockReturnData.data.incidentReports,
    ]);
  });
});
