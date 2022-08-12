import { renderHook } from "@testing-library/react-hooks";
import { useBondTxs } from "../useBondTxs";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";

const mockProps = {
  page: 1,
  limit: 50,
};
const mockData = {
  blockNumber: null,
  transactions: [],
  totalCount: 0,
};

describe("useBondTxs", () => {
  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>{children}</NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(
      () =>
        useBondTxs({
          limit: mockProps.limit,
          page: mockProps.page,
        }),
      { wrapper }
    );

    expect(result.current.data).toMatchObject(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });
});
