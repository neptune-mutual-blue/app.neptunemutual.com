import { useFetchReport } from "@/src/hooks/useFetchReport";

import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useFetchReport", () => {
  const { mock, mockFunction, restore } = mockFn.console.error();

  mockFn.getGraphURL();
  mockFn.getNetworkId();

  const args = [
    {
      coverKey:
        "0x7072696d65000000000000000000000000000000000000000000000000000000",
      productKey:
        "0x6161766500000000000000000000000000000000000000000000000000000000",
      incidentDate: new Date().getTime(),
    },
  ];

  test("should return correct data ", async () => {
    const mockData = {
      data: { incidentReport: { id: 1, reportedOn: new Date().getTime() } },
    };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useFetchReport, args, true);

    expect(result.data).toEqual(mockData.data);
    expect(result.loading).toBe(false);
    expect(typeof result.refetch).toBe("function");

    mockFn.fetch().unmock();
  });

  test("should log error if api error occurs", async () => {
    mockFn.fetch(false);
    mock();

    await renderHookWrapper(useFetchReport, args, true);
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });

  test("should execute the refetch function", async () => {
    const mockData = {
      data: { incidentReport: { id: 1, reportedOn: new Date().getTime() } },
    };
    mockFn.fetch(true, undefined, mockData);

    const { result, act } = await renderHookWrapper(useFetchReport, args, true);

    await act(async () => {
      await result.refetch();
    });

    mockFn.fetch().unmock();
  });
});
