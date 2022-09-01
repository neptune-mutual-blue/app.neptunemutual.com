import { useFetch } from "@/src/hooks/useFetch";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useFetch", () => {
  const { mock, mockFunction, restore } = mockFn.console.log();

  test("should return default hook result", async () => {
    const { result } = await renderHookWrapper(useFetch, ["fetch client data"]);

    expect(typeof result).toEqual("function");
  });

  test("should return correct data on success", async () => {
    const mockData = { data: "This is success response!" };
    mockFn.fetch(true, undefined, mockData);

    const { result, act } = await renderHookWrapper(useFetch, [
      "fetch client data",
    ]);
    await act(async () => {
      const response = await result();
      expect(response).toEqual(mockData);
    });

    mockFn.fetch().unmock();
  });

  test("should log the error if request aborted", async () => {
    const mockData = { message: "The user aborted a request" };
    mockFn.fetch(false, undefined, mockData);
    mock();

    const { result, act } = await renderHookWrapper(useFetch, [
      "fetch client data",
    ]);
    await act(async () => {
      await result();
    });
    expect(mockFunction).toHaveBeenCalledWith(
      `Aborted Request: fetch client data`
    );

    mockFn.fetch().unmock();
    restore();
  });

  test("should throw the error if request not aborted but error raised", async () => {
    const mockData = { message: "Invalid metadata" };
    mockFn.fetch(false, undefined, mockData);

    const { result, act } = await renderHookWrapper(useFetch, [
      "fetch client data",
    ]);

    let errorObject = undefined;
    await act(async () => {
      try {
        await result();
      } catch (e) {
        errorObject = e;
      }
    });
    expect(errorObject).toBeDefined();

    mockFn.fetch().unmock();
  });
});
