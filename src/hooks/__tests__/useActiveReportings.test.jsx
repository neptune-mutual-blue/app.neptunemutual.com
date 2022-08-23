import { renderHook, act } from "@testing-library/react-hooks";
import { useActiveReportings } from "../useActiveReportings";
import { getControlledPromise } from "@/utils/unit-tests/test-helpers";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

const mockResolveData = {
  data: {
    incidentReports: [
      {
        id: "x09319hdakn12313",
      },
    ],
  },
};

const mockReturnData = {
  data: {
    incidentReports: [
      {
        id: "x09319hdakn12313",
      },
      {
        id: "x09319hdakn12313",
      },
    ],
  },
};

jest.mock("@/src/context/Network", () => ({
  useNetwork: jest.fn().mockImplementation(() => ({ networkId: 43113 })),
}));

jest.mock("@/src/config/environment", () => ({
  getGraphURL: jest.fn().mockImplementation(() => "https://api.com"),
}));

describe("useActiveReportings", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();
  mock();

  test("while fetching data", () => {
    const { promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result } = renderHook(() => useActiveReportings());

    // default values while fetching
    expect(result.current.data.incidentReports).toEqual([]);
    expect(result.current.handleShowMore).toEqual(expect.any(Function));
    expect(result.current.loading).toBe(true);
    expect(result.current.hasMore).toBe(true);
  });

  test("when fetched successfully", async () => {
    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result, waitForNextUpdate } = renderHook(() =>
      useActiveReportings()
    );

    deferred.resolve({ json: () => mockReturnData });

    await waitForNextUpdate();

    // values when fetched successfully
    expect(result.current.data.incidentReports).toEqual(
      mockReturnData.data.incidentReports
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  test("when fetched error", async () => {
    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { waitForNextUpdate } = renderHook(() => useActiveReportings());

    deferred.reject();

    await waitForNextUpdate();

    // expected to receive a console.error
    expect(mockFunction).toHaveBeenCalled();

    restore();
  });

  test("when fetching more", async () => {
    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result, waitForNextUpdate } = renderHook(() =>
      useActiveReportings()
    );

    deferred.resolve({ json: () => mockResolveData });

    act(() => {
      result.current.handleShowMore();
    });

    await waitForNextUpdate();

    // values when fetching more
    expect(result.current.data.incidentReports).toEqual(
      mockReturnData.data.incidentReports
    );
  });
});
