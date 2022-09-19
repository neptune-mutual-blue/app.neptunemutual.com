import { useResolveIncident } from "@/src/hooks/useResolveIncident";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useResolveIncident", () => {
  mockFn.useWeb3React();
  mockFn.useNetwork();
  mockFn.useTxPoster();
  mockFn.useAuthValidation();
  mockFn.useTxToast();
  mockFn.useErrorNotifier();
  mockFn.sdk.registry.Resolution.getInstance();

  const args = [
    {
      coverKey:
        "0x7072696d65000000000000000000000000000000000000000000000000000000",
      productKey:
        "0x62616c616e636572000000000000000000000000000000000000000000000000",
      incidentDate: new Date().setDate(1),
    },
  ];

  test("should return default hook result", async () => {
    const { result } = await renderHookWrapper(useResolveIncident, args);

    expect(typeof result.resolve).toEqual("function");
    expect(typeof result.emergencyResolve).toEqual("function");
    expect(result.resolving).toEqual(false);
    expect(result.emergencyResolving).toEqual(false);
  });

  test("should be able to execute resolve function", async () => {
    const { result, act } = await renderHookWrapper(useResolveIncident, args);
    await act(async () => {
      await result.resolve();
    });

    expect(testData.txPoster.writeContract).toHaveBeenCalled();
  });

  test("should be able to execute emergencyResolve function", async () => {
    const { result, act } = await renderHookWrapper(useResolveIncident, args);
    const fnArgs = ["cancel", jest.fn()];
    await act(async () => {
      await result.emergencyResolve(...fnArgs);
    });

    expect(testData.txPoster.writeContract).toHaveBeenCalled();
  });

  test("should run auth function if no network or account in resolve function", async () => {
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.useWeb3React(() => ({ account: null }));

    const { result, act } = await renderHookWrapper(useResolveIncident, args);
    await act(async () => {
      await result.resolve();
    });

    expect(testData.authValidation.requiresAuth).toHaveBeenCalled();

    mockFn.useNetwork();
    mockFn.useWeb3React();
  });

  test("should call notifyError if error raised in resolve function", async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null,
    }));

    const { result, act } = await renderHookWrapper(useResolveIncident, [
      { ...args[0], productKey: "" },
    ]);
    await act(async () => {
      await result.resolve();
    });

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

    mockFn.useTxPoster();
  });

  test("should run auth function if no network or account in emergencyResolve function", async () => {
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.useWeb3React(() => ({ account: null }));

    const { result, act } = await renderHookWrapper(useResolveIncident, args);
    await act(async () => {
      await result.emergencyResolve("cancel");
    });

    expect(testData.authValidation.requiresAuth).toHaveBeenCalled();

    mockFn.useNetwork();
    mockFn.useWeb3React();
  });

  test("should call notifyError if error raised in emergencyResolve function", async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null,
    }));

    const { result, act } = await renderHookWrapper(useResolveIncident, [
      { ...args[0], productKey: "" },
    ]);
    const fnArgs = ["cancel", jest.fn()];
    await act(async () => {
      await result.emergencyResolve(...fnArgs);
    });

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

    mockFn.useTxPoster();
  });

  test("should be able to execute emergencyResolve function without success function", async () => {
    const { result, act } = await renderHookWrapper(useResolveIncident, args);
    const fnArgs = ["cancel"];
    await act(async () => {
      await result.emergencyResolve(...fnArgs);
    });

    expect(testData.txPoster.writeContract).toHaveBeenCalled();
  });
});
