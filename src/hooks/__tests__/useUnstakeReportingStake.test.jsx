import { useUnstakeReportingStake } from "../useUnstakeReportingStake";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";
import { testData } from "@/utils/unit-tests/test-data";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x6161766500000000000000000000000000000000000000000000000000000000",
  incidentDate: new Date().getTime(),
};

describe("useUnstakeReportingStake", () => {
  mockFn.useTxToast();
  mockFn.useAuthValidation();
  mockFn.useTxPoster();
  mockFn.useErrorNotifier();
  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.sdk.registry.Resolution.getInstance();
  mockFn.useAppConstants();

  test("calling unstake function w/o networkId and account", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps,
    ]);

    await act(async () => {
      await result.unstake();
    });

    expect(result.unstake).toEqual(expect.any(Function));
    expect(result.unstakeWithClaim).toEqual(expect.any(Function));
    expect(result.unstaking).toBe(false);
  });

  test("calling unstake function w/networkId and account", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps,
    ]);

    await act(async () => {
      await result.unstake();
    });

    expect(result.unstake).toEqual(expect.any(Function));
  });

  test("calling unstake function w/networkId and account and error", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined,
    }));

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps,
    ]);

    await act(async () => {
      await result.unstake();
    });

    expect(result.unstake).toEqual(expect.any(Function));
  });

  test("calling unstakeWithClaim function w/o networkId and account", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork(() => ({ networkId: null }));

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps,
    ]);

    await act(async () => {
      await result.unstakeWithClaim();
    });

    expect(result.unstake).toEqual(expect.any(Function));
    expect(result.unstakeWithClaim).toEqual(expect.any(Function));
    expect(result.unstaking).toBe(false);
  });

  test("calling unstakeWithClaim function w/networkId and account", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps,
    ]);

    await act(async () => {
      await result.unstakeWithClaim();
    });

    expect(result.unstakeWithClaim).toEqual(expect.any(Function));
  });

  test("calling unstakeWithClaim function w/networkId and account and error", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined,
    }));

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps,
    ]);

    await act(async () => {
      await result.unstakeWithClaim();
    });

    expect(result.unstakeWithClaim).toEqual(expect.any(Function));
  });
});
