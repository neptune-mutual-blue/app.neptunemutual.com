import { useConsensusReportingInfo } from "../useConsensusReportingInfo";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

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

describe("useConsensusReportingInfo", () => {
  const { mock, restore } = mockFn.consoleError();

  mockFn.utilsWeb3.getProviderOrSigner();

  test("while fetching w/o networkId and coverKey", async () => {
    mockFn.useNetwork(() => ({ networkId: null }));

    const { result } = await renderHookWrapper(useConsensusReportingInfo, [
      {
        coverKey: "",
        productKey: mockProps.productKey,
        incidentDate: mockProps.incidentDate,
      },
    ]);

    expect(result.info).toEqual(mockData.info);
    expect(result.refetch).toEqual(expect.any(Function));
  });

  test("while fetching w/ networkId, coverKey and account", async () => {
    mockFn.useNetwork();
    mockFn.useWeb3React();
    mockFn.getUnstakeInfoFor();

    const { result } = await renderHookWrapper(useConsensusReportingInfo, [
      [mockProps],
      true,
    ]);

    expect(result.info).toEqual(mockData.info);
  });

  test("while fetching w/ networkId, coverKey and w/o account", async () => {
    mockFn.useNetwork();
    mockFn.useWeb3React(() => ({ account: null }));
    mockFn.getReplacedString();
    mockFn.fetch(true, undefined, mockData);

    const { result } = await renderHookWrapper(useConsensusReportingInfo, [
      [mockProps],
      true,
    ]);

    expect(result.info).toEqual(mockData.info);
  });

  test("calling refetch function", async () => {
    mockFn.useNetwork();
    mockFn.useWeb3React();
    mockFn.getReplacedString();
    mockFn.fetch(true, undefined, mockData);

    const { result, act } = await renderHookWrapper(
      useConsensusReportingInfo,
      [mockProps],
      true
    );

    await act(async () => {
      await result.refetch();
    });

    expect(result.info).toEqual(mockData.info);
  });

  test("while fetching error", async () => {
    mockFn.fetch(false);
    mock();

    const { result } = await renderHookWrapper(
      useConsensusReportingInfo,
      [mockProps],
      true
    );

    expect(result.info).toEqual(mockData.info);

    mockFn.fetch().unmock();
    restore();
  });
});
