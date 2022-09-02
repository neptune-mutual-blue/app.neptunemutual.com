import { useRecentVotes } from "@/src/hooks/useRecentVotes";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

const mockProps = {
  coverKey:
    "0x6465666900000000000000000000000000000000000000000000000000000000",
  productKey:
    "0x31696e6368000000000000000000000000000000000000000000000000000000",
  page: 1,
  incidentDate: "1660795546",
  limit: 50,
};

const mockReturnData = {
  data: testData.recentVotes.data,
};

describe("useRecentVotes", () => {
  const { mock, mockFunction, restore } = mockFn.consoleError();
  mockFn.useWeb3React();
  mockFn.useNetwork();
  mockFn.getGraphURL();

  test("should return correct data", async () => {
    mockFn.fetch(true, undefined, mockReturnData);
    const { result } = await renderHookWrapper(
      useRecentVotes,
      [mockProps],
      true
    );
    expect(result.loading).toBeFalsy();
    expect(result.data.transactions.length).toBe(
      testData.recentVotes.data.votes.length
    );
  });

  test("should log error in case of api error", async () => {
    mockFn.fetch(false);
    mock();

    await renderHookWrapper(useRecentVotes, [mockProps], true);

    expect(mockFunction).toHaveBeenCalled();

    mockFn.fetch().unmock();
    restore();
  });

  test("should return null if coverkey and incident date not provided", async () => {
    const { result } = await renderHookWrapper(useRecentVotes, [
      { ...mockProps, incidentDate: "", coverKey: "" },
    ]);
    expect(result.data.transactions.length).toBe(0);
  });
});
