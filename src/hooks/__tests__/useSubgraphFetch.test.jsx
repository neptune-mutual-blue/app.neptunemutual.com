import {
  ERRORS_SUBGRAPH,
  useSubgraphFetch,
} from "@/src/hooks/useSubgraphFetch";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useSubgraphFetch", () => {
  const { mock, mockFunction, restore } = mockFn.console.log();
  mockFn.getGraphURL();

  const args = ["fetch data"];
  const fnArgs = [80001, "{id: 1, data: user}"];

  test("should return default hook result", async () => {
    const { result } = await renderHookWrapper(useSubgraphFetch, args);

    expect(typeof result).toEqual("function");
  });

  test("should return correct data from the result function", async () => {
    const mockData = { data: "hello" };
    mockFn.fetch(true, undefined, mockData);

    const { result, act } = await renderHookWrapper(useSubgraphFetch, args);

    await act(async () => {
      const res = await result(...fnArgs);
      expect(res).toEqual(mockData.data);
    });
  });

  test("should return error data if error response received", async () => {
    const mockData = { errors: "This is an error!" };
    mockFn.fetch(true, undefined, mockData);

    const { result, act } = await renderHookWrapper(useSubgraphFetch, args);

    await act(async () => {
      try {
        await result(...fnArgs);
      } catch (e) {
        expect(e.message).toEqual(`SUBGRAPH_DATA_ERROR`);
      }
    });
  });

  test("should log error data if error in fetching", async () => {
    const mockData = { message: "Fetch Error!" };
    mockFn.fetch(false, undefined, mockData);

    const { result, act } = await renderHookWrapper(useSubgraphFetch, args);

    await act(async () => {
      try {
        await result(...fnArgs);
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  test("should log error if aborted request error in fetching", async () => {
    mock();
    const mockData = {
      message: "The user aborted a request. Please try again",
    };
    mockFn.fetch(false, undefined, mockData);

    const { result, act } = await renderHookWrapper(useSubgraphFetch, args);

    await act(async () => {
      await result(...fnArgs);
      expect(mockFunction).toHaveBeenCalledWith(`Aborted Request: ${args[0]}`);
    });

    restore();
    mockFn.fetch().unmock();
  });

  test("should return null if no network id", async () => {
    const { result, act } = await renderHookWrapper(useSubgraphFetch, args);

    await act(async () => {
      const res = await result(null, fnArgs[1]);
      expect(res).toBeNull();
    });
  });

  test("should return error if no graph url", async () => {
    mockFn.getGraphURL(80001, true);

    const { result, act } = await renderHookWrapper(useSubgraphFetch, args);

    await act(async () => {
      try {
        await result(...fnArgs);
      } catch (err) {
        expect(err.message).toEqual(ERRORS_SUBGRAPH.UNKNOWN_SUBGRAPH_URL);
      }
    });
  });
});
