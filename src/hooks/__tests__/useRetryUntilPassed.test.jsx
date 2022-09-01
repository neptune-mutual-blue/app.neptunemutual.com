import { renderHook } from "@testing-library/react-hooks";
import { useRetryUntilPassed } from "../useRetryUntilPassed";

const mockProps = {
  callback: jest.fn().mockReturnValue(true),
  interval: 1000,
};

describe("useRetryUntilPassed", () => {
  test("should receive values", () => {
    jest.useFakeTimers();
    jest.spyOn(global, "setInterval");

    const { result } = renderHook(() =>
      useRetryUntilPassed(mockProps.callback, mockProps.interval)
    );

    jest.runAllTimers();

    expect(result.current).toBe(true);
    expect(mockProps.callback).toHaveBeenCalledTimes(2);
  });
});
