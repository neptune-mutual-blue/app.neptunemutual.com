import { renderHook } from "@testing-library/react-hooks";
import { useActiveReportings } from "../useActiveReportings";
import { NetworkProvider } from "@/src/context/Network";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";

describe("useActiveReportings", () => {
  test("should receive initial values", async () => {
    mockFn.getNetworkId();
    mockFn.useNetwork();
    mockFn.getGraphURL();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: async () => testData.resolvedReportings,
      })
    );

    const wrapper = ({ children }) => (
      <NetworkProvider>{children}</NetworkProvider>
    );

    const { result, waitForNextUpdate } = renderHook(
      () => useActiveReportings(),
      { wrapper }
    );

    expect(result.current.data.incidentReports).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.hasMore).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });
});
