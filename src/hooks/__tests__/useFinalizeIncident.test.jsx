import { useFinalizeIncident } from "@/src/hooks/useFinalizeIncident";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useFinalizeIncident", () => {
  mockFn.useWeb3React();
  mockFn.useNetwork();
  mockFn.useAuthValidation();
  mockFn.useTxToast();
  mockFn.useErrorNotifier();
  mockFn.useTxPoster();
  mockFn.sdk.registry.Resolution.getInstance();

  const args = [
    {
      coverKey:
        "0x7072696d65000000000000000000000000000000000000000000000000000000",
      productKey:
        "0x6161766500000000000000000000000000000000000000000000000000000000",
      incidentDate: new Date().getTime(),
    },
  ];

  test("should return correct data ", async () => {
    const { result } = await renderHookWrapper(useFinalizeIncident, args);

    expect(typeof result.finalize).toBe("function");
    expect(result.finalizing).toBe(false);
  });

  test("shoudl be able to execute the finalize function", async () => {
    const { result, act } = await renderHookWrapper(useFinalizeIncident, args);

    await act(async () => {
      await result.finalize();
    });
  });

  test("shoudl return if no networkId or account in finalize function", async () => {
    mockFn.useNetwork(() => ({ networkId: null }));
    mockFn.useWeb3React(() => ({ account: null }));

    const { result, act } = await renderHookWrapper(useFinalizeIncident, args);

    await act(async () => {
      await result.finalize(jest.fn());
    });

    mockFn.useNetwork();
    mockFn.useWeb3React();
  });

  describe("Edge cases coverage", () => {
    test("shoudl use empty bytes32 if no product key provided", async () => {
      const { result, act } = await renderHookWrapper(useFinalizeIncident, [
        { ...args[0], productKey: "" },
      ]);

      await act(async () => {
        await result.finalize(jest.fn());
      });
    });

    test("shoudl return if error in writing to contract", async () => {
      mockFn.useTxPoster(() => ({
        ...testData.txPoster,
        writeContract: null,
      }));

      const { result, act } = await renderHookWrapper(
        useFinalizeIncident,
        args
      );

      await act(async () => {
        await result.finalize(jest.fn());
      });
      expect(testData.errorNotifier.notifyError).toHaveBeenCalled();
    });
  });
});
