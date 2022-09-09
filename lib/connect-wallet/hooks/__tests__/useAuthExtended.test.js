import { testData } from "@/utils/unit-tests/test-data";
import { delay } from "@/utils/unit-tests/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";
import useAuth from "../useAuth";

jest.mock("../../utils/connectors", () => ({
  getConnectorByName: async (name, chainId) => {
    const c = await import("../../injected/connector");

    return c.getConnector(chainId);
  },
}));

describe("useAuth with custom Connector name", () => {
  const notify = jest.fn();
  test("Connect to Injected with common Error", async () => {
    const connector = {
      addListener: jest.fn(() => {}),
      removeListener: jest.fn(() => {}),
    };

    const activate = jest.fn((name, cb) => {
      cb(new Error());
    });
    const deactivate = jest.fn();
    mockFn.useWeb3React(() => ({
      ...testData.account,
      connector,
      activate,
      deactivate,
    }));
    const { result } = renderHook(() =>
      useAuth(testData.network.networkId, notify)
    );

    result.current.login("UNKNOWN");

    await delay(110);
    expect(activate).toBeCalled();
  });
});
