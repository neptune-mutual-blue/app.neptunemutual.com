import { renderHook } from "@testing-library/react-hooks";
import { useActivePoliciesByCover } from "../useActivePoliciesByCover";
import BigNumber from "bignumber.js";
import { getControlledPromise } from "@/utils/unit-tests/test-helpers";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { useWeb3React } from "@web3-react/core";
import { useNetwork } from "@/src/context/Network";
import { getGraphURL } from "@/src/config/environment";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x62616c616e636572000000000000000000000000000000000000000000000000",
  page: 1,
  limit: 50,
};

const mockReturnData = {
  data: {
    userPolicies: [
      {
        totalAmountToCover: "1000",
      },
    ],
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

jest.mock("@/src/config/environment", () => ({
  getGraphURL: jest.fn(),
}));

describe("useActivePoliciesByCover", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();
  mock();

  test("while fetching data without account,networkId and graphurl", async () => {
    useWeb3React.mockImplementation(() => ({ account: null }));
    useNetwork.mockImplementation(() => ({ networkId: null }));
    getGraphURL.mockImplementation(() => "");

    const { promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result } = renderHook(() => useActivePoliciesByCover(mockProps));

    // default values while fetching without account, networkId and graphurl
    expect(result.current.data.activePolicies).toEqual([]);
    expect(result.current.data.totalActiveProtection).toEqual(
      new BigNumber("0")
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  test("while fetching data with account and networkId", async () => {
    useWeb3React.mockImplementation(() => ({ account: "0x32423dfsf34" }));
    useNetwork.mockImplementation(() => ({ networkId: 43113 }));
    getGraphURL.mockImplementation(() => "https://api.com");

    const { promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result } = renderHook(() => useActivePoliciesByCover(mockProps));

    // default values while fetching with account and networkId
    expect(result.current.data.activePolicies).toEqual([]);
    expect(result.current.data.totalActiveProtection).toEqual(
      new BigNumber("0")
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.hasMore).toBe(true);
  });

  test("when fetched successfully", async () => {
    useWeb3React.mockImplementation(() => ({ account: "0x32423dfsf34" }));
    useNetwork.mockImplementation(() => ({ networkId: 43113 }));
    getGraphURL.mockImplementation(() => "https://api.com");

    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result, waitForNextUpdate } = renderHook(() =>
      useActivePoliciesByCover(mockProps)
    );

    deferred.resolve({ json: () => mockReturnData });

    await waitForNextUpdate();

    // values when fetched successfully
    expect(result.current.data.activePolicies).toEqual([
      mockReturnData.data.userPolicies[0],
    ]);
    expect(result.current.data.totalActiveProtection).toEqual(
      new BigNumber("1000")
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  test("when fetched error", async () => {
    useWeb3React.mockImplementation(() => ({ account: "0x32423dfsf34" }));
    useNetwork.mockImplementation(() => ({ networkId: 43113 }));
    getGraphURL.mockImplementation(() => "https://api.com");

    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { waitForNextUpdate } = renderHook(() =>
      useActivePoliciesByCover(mockProps)
    );

    deferred.reject();

    await waitForNextUpdate();

    // expected to receive a console.error
    expect(mockFunction).toHaveBeenCalled();

    restore();
  });
});
