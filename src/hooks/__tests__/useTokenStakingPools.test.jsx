import { useTokenStakingPools } from "@/src/hooks/useTokenStakingPools";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockReturnData = {
  data: {
    pools: [
      {
        id: "x2314423423",
      },
    ],
  },
};

describe("useTokenStakingPools", () => {
  const { mock, restore, mockFunction } = mockFn.console.error();

  mockFn.utilsWeb3.getProviderOrSigner();
  mockFn.useTxPoster();
  mockFn.getGraphURL();

  test("while fetching w/o networkId", async () => {
    mockFn.useNetwork(() => ({ networkId: null }));

    const { result } = await renderHookWrapper(useTokenStakingPools, [], true);

    expect(result.handleShowMore).toEqual(expect.any(Function));
    expect(result.hasMore).toBe(false);
    expect(result.data.pools).toEqual([]);
    expect(result.loading).toBe(false);
  });

  test("while fetching successful", async () => {
    mockFn.useNetwork();
    mockFn.fetch(true, undefined, mockReturnData);

    const { result } = await renderHookWrapper(useTokenStakingPools, [], true);

    expect(result.data.pools).toEqual([...mockReturnData.data.pools]);
  });

  test("while fetching error", async () => {
    mockFn.fetch(false);
    mock();

    const { result } = await renderHookWrapper(useTokenStakingPools, [], true);

    expect(result.handleShowMore).toEqual(expect.any(Function));
    expect(result.hasMore).toBe(true);
    expect(result.data.pools).toEqual([]);
    expect(result.loading).toBe(false);
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });

  test("calling handleShowMore function", async () => {
    mockFn.fetch(true, undefined, mockReturnData);

    const { result, act } = await renderHookWrapper(
      useTokenStakingPools,
      [],
      true
    );

    await act(async () => {
      await result.handleShowMore();
    });

    expect(result.data.pools).toEqual([...mockReturnData.data.pools]);
  });
});
