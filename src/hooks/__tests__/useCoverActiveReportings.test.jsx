import { renderHook } from "@testing-library/react-hooks";
import { useCoverActiveReportings } from "../useCoverActiveReportings";
import { getControlledPromise } from "@/utils/unit-tests/test-helpers";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
};

const mockResolvedData = {
  data: {
    incidentReports: [
      {
        id: "0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1661159947",
        incidentDate: "1661159947",
        productKey:
          "0x31696e6368000000000000000000000000000000000000000000000000000000",
        status: "Reporting",
      },
    ],
  },
};

const mockReturnData = {
  data: [
    {
      id: "0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1661159947",
      incidentDate: "1661159947",
      productKey:
        "0x31696e6368000000000000000000000000000000000000000000000000000000",
      status: "Reporting",
    },
  ],
};

jest.mock("@/src/config/environment", () => ({
  getGraphURL: jest.fn().mockImplementation(() => "https://api.com"),
  getNetworkId: jest.fn().mockImplementation(() => 43113),
}));

describe("useCoverActiveReportings", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();
  mock();

  test("while fetching data", () => {
    const { promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result } = renderHook(() => useCoverActiveReportings(mockProps));

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  test("when fetched successfully", async () => {
    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result, waitForNextUpdate } = renderHook(() =>
      useCoverActiveReportings(mockProps)
    );

    deferred.resolve({ json: () => mockResolvedData });

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockReturnData.data);
    expect(result.current.loading).toBe(false);
  });

  test("when fetched error", async () => {
    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { waitForNextUpdate } = renderHook(() =>
      useCoverActiveReportings(mockProps)
    );

    deferred.reject();

    await waitForNextUpdate();

    expect(mockFunction).toHaveBeenCalled();

    restore();
  });
});
