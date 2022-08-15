import { renderHook } from "@testing-library/react-hooks";
import { useActiveReportings } from "../useActiveReportings";
import { NetworkProvider } from "@/src/context/Network";

describe("useActiveReportings", () => {
  test("should receive initial values", async () => {
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
