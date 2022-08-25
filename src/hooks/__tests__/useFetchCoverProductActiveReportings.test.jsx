import { useFetchCoverProductActiveReportings } from "@/src/hooks/useFetchCoverProductActiveReportings";

import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useFetchCoverProductActiveReportings", () => {
  const { mock, mockFunction, restore } = mockFn.consoleError();

  mockFn.useNetwork();
  mockFn.getGraphURL();
  mockFn.getNetworkId();

  const args = [
    {
      coverKey:
        "0x7072696d65000000000000000000000000000000000000000000000000000000",
      productKey:
        "0x6161766500000000000000000000000000000000000000000000000000000000",
    },
  ];

  test("should return default value", async () => {
    const mockData = { data: {} };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(
      useFetchCoverProductActiveReportings,
      args
    );

    expect(result.data).toEqual([]);
    expect(result.loading).toBeFalsy();

    mockFn.fetch().unmock();
  });

  test("should return correct value as returned from api", async () => {
    const mockData = {
      data: { incidentReports: { id: "1", reportedOn: new Date().getTime() } },
    };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(
      useFetchCoverProductActiveReportings,
      args,
      true
    );

    expect(result.data).toEqual(mockData.data.incidentReports);

    mockFn.fetch().unmock();
  });

  test("should log error if api error occurs", async () => {
    mockFn.fetch(false);
    mock(); // mocking console.error

    await renderHookWrapper(useFetchCoverProductActiveReportings, args, true);

    expect(mockFunction).toHaveBeenCalled();

    restore();
    mockFn.fetch().unmock();
  });

  test("should return if no product key & cover key available", async () => {
    const { result } = await renderHookWrapper(
      useFetchCoverProductActiveReportings,
      [{ coverKey: "", productKey: "" }]
    );

    expect(result.data).toEqual([]);
  });
});
