import { useActiveLocale } from "@/src/hooks/useActiveLocale";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { renderHook } from "@testing-library/react-hooks";

describe("useActiveLocal", () => {
  mockFn.useRouter();

  test("should return the active local", () => {
    const { result } = renderHook(() => useActiveLocale());
    expect(result.current).toBe(testData.router.locale);
  });

  test("should return correct value based on useRouter", () => {
    mockFn.useRouter(() => ({
      ...testData.router,
      locale: "zh",
    }));
    const { result } = renderHook(() => useActiveLocale());
    expect(result.current).toBe("zh");
  });

  test("should get value from navigatorLocale function if useRouter is not available", () => {
    mockFn.useRouter(() => ({
      ...testData.router,
      locale: undefined,
    }));

    const { result } = renderHook(() => useActiveLocale());
    expect(result.current).toBe("en");
  });
});
