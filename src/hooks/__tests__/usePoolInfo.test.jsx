import { defaultInfo, usePoolInfo } from "@/src/hooks/usePoolInfo";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("usePoolInfo", () => {
  const { mock, mockFunction, restore } = mockFn.console.error();
  mockFn.useNetwork();
  mockFn.useWeb3React();
  mockFn.useErrorNotifier();

  const args = [{ key: 12345, type: "pod" }];

  test("should return default hook result", async () => {
    mockFn.fetch();

    const { result } = await renderHookWrapper(usePoolInfo, args);
    expect(result.info).toEqual(defaultInfo);
    expect(typeof result.refetch).toEqual("function");

    mockFn.fetch().unmock();
  });

  test("should return data as retured from api", async () => {
    const mockData = {
      data: {
        ...defaultInfo,
        name: "test",
        rewardToken: 1093,
        rewardPerBlock: 10,
        canWithdrawFromBlockHeight: true,
        lastDepositHeight: "857",
        lastRewardHeight: "9855",
      },
    };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(usePoolInfo, args, true);
    expect(result.info).toEqual(mockData.data);

    mockFn.fetch().unmock();
  });

  test("should run notifyError function if error arises", async () => {
    mockFn.fetch(false);

    await renderHookWrapper(usePoolInfo, args);
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled();

    mockFn.fetch().unmock();
  });

  test("should return default value if no network", async () => {
    mockFn.useNetwork(() => ({ networkId: null }));

    const { result } = await renderHookWrapper(usePoolInfo, args);
    expect(result.info).toEqual(defaultInfo);

    mockFn.useNetwork();
  });

  test("should be able to execute the refetch function", async () => {
    mockFn.fetch();

    const { result, renderHookResult, act } = await renderHookWrapper(
      usePoolInfo,
      args
    );
    await act(async () => {
      await result.refetch();
    });
    expect(renderHookResult.current.info).toEqual(defaultInfo);

    mockFn.fetch().unmock();
  });

  test("should get correct result from refetch function", async () => {
    const mockData = {
      data: {
        ...defaultInfo,
        name: "mock-test",
        lastDepositHeight: "857",
        lastRewardHeight: "9855",
      },
    };
    mockFn.fetch(true, undefined, mockData);

    const { result, renderHookResult, act } = await renderHookWrapper(
      usePoolInfo,
      [{ key: 12345 }],
      true
    );
    await act(async () => {
      await result.refetch();
    });
    expect(renderHookResult.current.info).toEqual(mockData.data);

    mockFn.fetch().unmock();
  });

  test("should log error if error arises in fetchPoolInfo", async () => {
    mockFn.fetch(false);
    mockFn.useErrorNotifier(() => ({ notifyError: null }));
    mock();

    await renderHookWrapper(usePoolInfo, args);
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    mockFn.useErrorNotifier();
    restore();
  });
});
