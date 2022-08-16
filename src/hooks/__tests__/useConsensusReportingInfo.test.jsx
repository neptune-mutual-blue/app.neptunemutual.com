import { renderHook } from "@testing-library/react-hooks";
import { useConsensusReportingInfo } from "../useConsensusReportingInfo";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";

const mockProps = {
  coverKey:
    "0x7072696d65000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x62616c616e636572000000000000000000000000000000000000000000000000",
  incidentDate: "",
};

const mockData = {
  info: {
    yes: "0",
    no: "0",
    myYes: "0",
    myNo: "0",
    totalStakeInWinningCamp: "0",
    totalStakeInLosingCamp: "0",
    myStakeInWinningCamp: "0",
    unstaken: "0",
    latestIncidentDate: "0",
    burnRate: "0",
    reporterCommission: "0",
    allocatedReward: "0",
    toBurn: "0",
    toReporter: "0",
    myReward: "0",
    willReceive: "0",
  },
};

const unmockedFetch = global.fetch;

describe("useConsensusReportingInfo", () => {
  beforeAll(() => {
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      });
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  test("should receive values", () => {
    const wrapper = ({ children }) => (
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>{children}</NetworkProvider>
      </Web3ReactProvider>
    );

    const { result } = renderHook(() => useConsensusReportingInfo(mockProps), {
      wrapper,
    });

    expect(result.current.info).toEqual(mockData.info);
    expect(result.current.refetch).toEqual(expect.any(Function));
  });
});
