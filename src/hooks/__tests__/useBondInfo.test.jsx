import { renderHook } from "@testing-library/react-hooks";
import { useBondInfo } from "../useBondInfo";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import { TxPosterProvider } from "@/src/context/TxPoster";

const unmockedFetch = global.fetch;
const mockData = {
  lpTokenAddress: "",
  discountRate: "0",
  vestingTerm: "0",
  maxBond: "0",
  totalNpmAllocated: "0",
  totalNpmDistributed: "0",
  bondContribution: "0",
  claimable: "0",
  unlockDate: "0",
};

describe("useBondInfo", () => {
  beforeAll(() => {
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>
          <TxPosterProvider>{children}</TxPosterProvider>
        </NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(() => useBondInfo(), {
      wrapper,
    });

    expect(result.current.info).toMatchObject(mockData);
  });
});
