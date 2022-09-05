import { useValidReport } from "../useValidReport";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockProps = {
  start: "1658819063",
  end: "1664582399",
  coverKey:
    "0x6262382d65786368616e67650000000000000000000000000000000000000000",
  productKey:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
};

const mockReturnData = {
  data: {
    incidentReports: [
      {
        id: "1",
      },
    ],
  },
};

describe("useValidReport", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();

  mockFn.useNetwork();
  mockFn.getGraphURL();

  test("while fetching is not valid timestamp", async () => {
    const { result } = await renderHookWrapper(useValidReport, [
      {
        ...mockProps,
        start: "",
        end: "",
      },
    ]);

    expect(result.data.report).toEqual(undefined);
    expect(result.loading).toBe(false);
  });

  test("while fetching is valid timestamp", async () => {
    mockFn.fetch(true, undefined, mockReturnData);

    const { result } = await renderHookWrapper(
      useValidReport,
      [mockProps],
      true
    );

    expect(result.data.report).toEqual({
      id: "1",
    });
    expect(result.loading).toBe(false);
  });

  test("while fetching error", async () => {
    mockFn.fetch(false);
    mock();

    const { result } = await renderHookWrapper(
      useValidReport,
      [mockProps],
      true
    );

    expect(result.data.report).toEqual(undefined);
    expect(result.loading).toBe(false);
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });
});
