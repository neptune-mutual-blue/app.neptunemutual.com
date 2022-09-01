import { usePolicyTxs } from "@/src/hooks/usePolicyTxs";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("usePolicyTxs", () => {
  const { mock, mockFunction, restore } = mockFn.console.error();
  mockFn.useNetwork();
  mockFn.useWeb3React();
  mockFn.getGraphURL();

  const args = [{ limit: 10, page: 1 }];

  test("should return default hook result", async () => {
    mockFn.fetch();
    const { result } = await renderHookWrapper(usePolicyTxs, args);

    expect(result.data.blockNumber).toBeNull();
    expect(result.data.transactions).toEqual([]);
    expect(result.data.totalCount).toEqual(0);
    expect(result.loading).toEqual(false);
    expect(result.hasMore).toEqual(true);

    mockFn.fetch().unmock();
  });

  test("should return value as returned from api", async () => {
    const mockData = {
      data: {
        _meta: { block: { number: 123456 } },
        policyTransactions: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    };
    mockFn.fetch(true, undefined, mockData);
    const { result } = await renderHookWrapper(usePolicyTxs, args, true);

    expect(result.data.blockNumber).toEqual(mockData.data._meta.block.number);
    expect(result.data.transactions).toEqual(mockData.data.policyTransactions);
    expect(result.data.totalCount).toEqual(
      mockData.data.policyTransactions.length
    );

    mockFn.fetch().unmock();
  });

  test("should return default value if no account", async () => {
    mockFn.useWeb3React(() => ({ account: null }));

    const { result } = await renderHookWrapper(usePolicyTxs, args);

    expect(result.data.blockNumber).toBeNull();
    expect(result.data.transactions).toEqual([]);
    expect(result.data.totalCount).toEqual(0);
    expect(result.loading).toEqual(false);
    expect(result.hasMore).toEqual(true);

    mockFn.useWeb3React();
  });

  test("should log error if error rises", async () => {
    mockFn.fetch(false);
    mock();

    await renderHookWrapper(usePolicyTxs, args);
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });

  test("should not set hasMore to false if not last page", async () => {
    const mockData = {
      data: {
        _meta: { block: { number: 1 } },
        policyTransactions: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    };
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(usePolicyTxs, [
      { ...args[0], limit: 3 },
    ]);
    expect(result.hasMore).toEqual(true);

    mockFn.fetch().unmock();
  });
});
