import { useAuthValidation } from "../useAuthValidation";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useAuthValidation", () => {
  mockFn.useToast();

  test("should return nothing", async () => {
    mockFn.useWeb3React(() => ({ account: null }));

    const { result, act } = await renderHookWrapper(useAuthValidation);

    act(() => {
      result.requiresAuth();
    });

    expect(result.requiresAuth).toEqual(expect.any(Function));
  });

  test("should require auth", async () => {
    mockFn.useWeb3React(() => ({ account: "0x32423dfsf34" }));

    const { result, act } = await renderHookWrapper(useAuthValidation);

    act(() => {
      result.requiresAuth();
    });

    expect(result.requiresAuth).toEqual(expect.any(Function));
  });
});
