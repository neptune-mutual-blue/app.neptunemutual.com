import { ConnectorNames } from "@/lib/connect-wallet/config/connectors";
import { testData } from "@/utils/unit-tests/test-data";
import * as wallet from "../wallet";

describe("Wallet", () => {
  test("Register Token: No ethereum", async () => {
    global.ethereum = undefined;

    const result = await wallet.registerToken(
      testData.tokenBalanceProps.tokenAddress,
      "NPM",
      testData.tokenBalanceProps.tokenDecimals,
      ""
    );

    expect(result).toBeFalsy();
    expect(result).toBe(false);
  });

  test("Register Token: No ethereum", async () => {
    const ethereum = {
      request: jest.fn(),
    };
    global.ethereum = ethereum;

    wallet.registerToken(
      testData.tokenBalanceProps.tokenAddress,
      "NPM",
      testData.tokenBalanceProps.tokenDecimals,
      ""
    );

    expect(ethereum.request).toBeCalled();
  });

  test("Setup Network: Injected", async () => {
    const result = await wallet.setupNetwork(
      ConnectorNames.Injected,
      testData.network.networkId
    );

    expect(result).toBeTruthy();
    expect(result).toBe(true);
  });

  test("Setup Network: Binance", async () => {
    global.BinanceChain = {
      switchNetwork: jest.fn(() => Promise.resolve()),
    };
    const result = await wallet.setupNetwork(ConnectorNames.BSC, 97);

    expect(result).toBeTruthy();
    expect(result).toBe(true);
  });

  test("Setup Network: Unknown", async () => {
    const result = await wallet.setupNetwork(
      "Unknown",
      testData.network.networkId
    );

    expect(result).toBeFalsy();
    expect(result).toBe(false);
  });

  test("Setup Network: Unknown with no Chain Id", async () => {
    const result = await wallet.setupNetwork("Unknown", "");

    expect(result).toBeFalsy();
    expect(result).toBe(false);
  });
});
