import { renderHook, act } from "@testing-library/react-hooks";
import { useAuthValidation } from "../useAuthValidation";
import { useWeb3React } from "@web3-react/core";

jest.mock("@web3-react/core", () => ({
  useWeb3React: jest.fn(),
}));

jest.mock("@/lib/toast/context", () => ({
  useToast: jest.fn().mockImplementation(() => ({ pushError: () => {} })),
}));

describe("useAuthValidation", () => {
  test("should return nothing", async () => {
    useWeb3React.mockImplementation(() => ({ account: null }));
    const { result } = renderHook(() => useAuthValidation());

    act(() => {
      result.current.requiresAuth();
    });

    expect(result.current.requiresAuth).toEqual(expect.any(Function));
  });

  test("should require auth", async () => {
    useWeb3React.mockImplementation(() => ({ account: "0x32423dfsf34" }));
    const { result } = renderHook(() => useAuthValidation());

    act(() => {
      result.current.requiresAuth();
    });

    expect(result.current.requiresAuth).toEqual(expect.any(Function));
  });
});
