import { renderHook } from "@testing-library/react-hooks";
import { useBondTxs } from "../useBondTxs";
import { useWeb3React } from "@web3-react/core";
import { getControlledPromise } from "@/utils/unit-tests/test-helpers";
import { useNetwork } from "@/src/context/Network";
import { getGraphURL } from "@/src/config/environment";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

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

jest.mock("@web3-react/core", () => ({
  useWeb3React: jest.fn(),
}));

jest.mock("@/src/context/Network", () => ({
  useNetwork: jest.fn(),
}));

jest.mock("@/src/config/environment", () => ({
  getGraphURL: jest.fn(),
}));

describe("useBondTxs", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();
  mock();

  test("while fetching data w/o account", () => {
    useWeb3React.mockImplementation(() => ({ account: null }));
    useNetwork.mockImplementation(() => ({ networkId: 43113 }));

    const { promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result } = renderHook(() => useBondTxs(mockProps));

    expect(result.current.data).toEqual({
      blockNumber: null,
      transactions: [],
      totalCount: 0,
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  test("while fetching data with account and successfully", async () => {
    useWeb3React.mockImplementation(() => ({ account: "0x32423dfsf34" }));
    useNetwork.mockImplementation(() => ({ networkId: 43113 }));
    getGraphURL.mockImplementation(() => "https://api.com");

    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result, waitForNextUpdate } = renderHook(() =>
      useBondTxs(mockProps)
    );

    deferred.resolve({ json: () => mockResolvedData });

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockReturnData.data);
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  test("while fetching data with account and error", async () => {
    useWeb3React.mockImplementation(() => ({ account: "0x32423dfsf34" }));
    useNetwork.mockImplementation(() => ({ networkId: 43113 }));
    getGraphURL.mockImplementation(() => "https://api.com");

    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { waitForNextUpdate } = renderHook(() => useBondTxs(mockProps));

    deferred.reject();

    await waitForNextUpdate();

    expect(mockFunction).toHaveBeenCalled();

    restore();
  });
});
