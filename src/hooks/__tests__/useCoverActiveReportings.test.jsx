import { renderHook } from "@testing-library/react-hooks";
import { useCoverActiveReportings } from "../useCoverActiveReportings";

const mockProps = {
  coverKey: "",
};

describe("useCoverActiveReportings", () => {
  test("should receive values", () => {
    const { result } = renderHook(() => useCoverActiveReportings(mockProps));

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
