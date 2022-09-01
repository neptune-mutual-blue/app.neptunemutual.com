import { useBondTxs } from "../useBondTxs";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockProps = {
  page: 1,
  limit: 50,
};

const mockResolvedData = {
  data: {
    _meta: {
      block: {
        number: 10,
      },
    },
    bondTransactions: [{ id: "12312sa312" }],
  },
};

const mockReturnData = {
  data: {
    blockNumber: 10,
    transactions: [{ id: "12312sa312" }],
    totalCount: 1,
  },
};

describe("useBondTxs", () => {
  const { mock, restore, mockFunction } = mockFn.console.error();

  test("while fetching data w/o account", async () => {
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.useNetwork();

    const { result } = await renderHookWrapper(useBondTxs, [mockProps]);

    expect(result.data).toEqual({
      blockNumber: null,
      transactions: [],
      totalCount: 0,
    });
    expect(result.loading).toBe(false);
    expect(result.hasMore).toBe(true);
  });

  test("while fetching data with account and successfully", async () => {
    mockFn.useWeb3React();
    mockFn.useNetwork();
    mockFn.getGraphURL();
    mockFn.fetch(true, undefined, mockResolvedData);

    const { result } = await renderHookWrapper(useBondTxs, [mockProps], true);

    expect(result.data).toEqual(mockReturnData.data);
  });

  test("while fetching data with account and error", async () => {
    mockFn.fetch(false);
    mock();

    const { result } = await renderHookWrapper(useBondTxs, [mockProps], true);

    expect(result.data).toEqual({
      blockNumber: null,
      transactions: [],
      totalCount: 0,
    });
    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });
});
