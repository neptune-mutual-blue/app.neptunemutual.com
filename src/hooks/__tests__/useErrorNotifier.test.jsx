import { getErrorMessage } from "@/src/helpers/tx";
import { defaultArgs, useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";
import { ERROR_TOAST_TIME } from "@/src/config/toast";

describe("useErrorNotifier", () => {
  mockFn.useToast();
  const { mock, mockFunction } = mockFn.consoleError();
  mock();

  const args = [{ duration: 5000 }];

  test("should return default value", async () => {
    const { result, unmount } = await renderHookWrapper(useErrorNotifier, args);

    expect(typeof result.notifyError).toBe("function");

    unmount();
  });

  test("should execute notifyError function", async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier, args);

    act(() => {
      result.notifyError({});
    });
  });

  test("should print the error", async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier, args);

    act(() => {
      result.notifyError({ data: "Error occured!" });
    });
    expect(mockFunction).toHaveBeenCalledWith({ data: "Error occured!" });
  });

  test("should call the toast.pushError function", async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier, args);

    act(() => {
      result.notifyError({ data: "Error occured!" });
    });

    const pushErrorArgs = {
      title: "Error occured!",
      message: getErrorMessage({ error: "Error occured!" }),
      lifetime: args[0].duration,
    };

    expect(testData.toast.pushError).toHaveBeenCalledWith(pushErrorArgs);
  });

  test("should use default argument if not provided", async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier);

    act(() => {
      result.notifyError({});
    });

    const pushErrorArgs = {
      title: "Could not perform action",
      message: getErrorMessage({}),
      lifetime: defaultArgs.duration,
    };

    expect(testData.toast.pushError).toHaveBeenCalledWith(pushErrorArgs);
  });

  test("should use default duration if not provided", async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier, [{}]);

    act(() => {
      result.notifyError({});
    });

    const pushErrorArgs = {
      title: "Could not perform action",
      message: getErrorMessage({}),
      lifetime: ERROR_TOAST_TIME,
    };

    expect(testData.toast.pushError).toHaveBeenCalledWith(pushErrorArgs);
  });
});
