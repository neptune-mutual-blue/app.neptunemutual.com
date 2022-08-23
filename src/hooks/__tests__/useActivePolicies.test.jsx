import { renderHook } from "@testing-library/react-hooks";
import { useActivePolicies } from "../useActivePolicies";
import BigNumber from "bignumber.js";
import { getControlledPromise } from "@/utils/unit-tests/test-helpers";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

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
  useWeb3React: jest
    .fn()
    .mockImplementation(() => ({ account: "0x32423dfsf34" })),
}));

jest.mock("@/src/context/Network", () => ({
  useNetwork: jest.fn().mockImplementation(() => ({ networkId: 43113 })),
}));

jest.mock("@/src/config/environment", () => ({
  getGraphURL: jest.fn().mockImplementation(() => "https://api.com"),
}));

describe("useActivePolicies", () => {
  const { mock, restore, mockFunction } = mockFn.consoleError();
  mock();

  test("while fetching data", async () => {
    const { promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result } = renderHook(() => useActivePolicies());

    // default values while fetching
    expect(result.current.data.activePolicies).toEqual([]);
    expect(result.current.data.totalActiveProtection).toEqual(
      new BigNumber("0")
    );
    expect(result.current.loading).toBe(true);
  });

  test("when fetched successfully", async () => {
    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { result, waitForNextUpdate } = renderHook(() => useActivePolicies());

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
  });

  test("when fetched error", async () => {
    const { deferred, promise } = getControlledPromise();

    global.fetch = jest.fn(() => promise);

    const { waitForNextUpdate } = renderHook(() => useActivePolicies());

    deferred.reject();

    await waitForNextUpdate();

    // expected to receive a console.error
    expect(mockFunction).toHaveBeenCalled();

    restore();
  });
});
