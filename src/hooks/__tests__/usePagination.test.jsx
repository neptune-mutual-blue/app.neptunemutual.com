import { ROWS_PER_PAGE } from "@/src/config/constants";
import { usePagination } from "@/src/hooks/usePagination";
import { renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("usePagination", () => {
  const args = [
    {
      defaultLimit: 25,
    },
  ];

  test("should return default hook result", async () => {
    const { result } = await renderHookWrapper(usePagination);

    expect(result.page).toEqual(1);
    expect(result.limit).toEqual(ROWS_PER_PAGE);
    expect(typeof result.setPage).toEqual("function");
    expect(typeof result.setLimit).toEqual("function");
  });

  test("should return hook result based on args", async () => {
    const { result } = await renderHookWrapper(usePagination, args);

    expect(result.limit).toEqual(args[0].defaultLimit);
  });
});
