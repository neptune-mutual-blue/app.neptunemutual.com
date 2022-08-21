import { renderHook } from "@testing-library/react-hooks";
import { useBlockHeight } from "../useBlockHeight";
import { useWeb3React } from "@web3-react/core";
import { useNetwork } from "@/src/context/Network";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

jest.mock("@web3-react/core", () => ({
  useWeb3React: jest.fn(),
}));

jest.mock("@/src/context/Network", () => ({
  useNetwork: jest.fn(),
}));

jest.mock("@/lib/connect-wallet/utils/web3", () => ({
  getProviderOrSigner: jest.fn(),
}));

describe("useBlockHeight", () => {
  test("should not receive block height", async () => {
    useWeb3React.mockImplementation(() => ({
      account: null,
    }));
    useNetwork.mockImplementation(() => ({ networkId: null }));
    getProviderOrSigner.mockImplementation(() => null);

    const { result } = renderHook(() => useBlockHeight());

    expect(result.current).toEqual(1);
  });

  test("should receive block height", async () => {
    useWeb3React.mockImplementation(() => ({
      library: "asd2312das",
      account: "0x32423dfsf34",
    }));
    useNetwork.mockImplementation(() => ({ networkId: 43113 }));
    getProviderOrSigner.mockImplementation(() => ({
      provider: {
        getBlockNumber: () => {
          return new Promise((resolve) => {
            resolve(100);
          });
        },
      },
    }));

    const { result, waitForNextUpdate } = renderHook(() => useBlockHeight());

    await waitForNextUpdate();

    expect(result.current).toEqual(100);
  });
});
