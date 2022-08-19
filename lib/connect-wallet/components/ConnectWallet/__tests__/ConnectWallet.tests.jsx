import React from "react";
import { fireEvent, screen, waitFor } from "@/utils/unit-tests/test-utils";
import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { i18n } from "@lingui/core";
import ConnectWallet from "./../ConnectWallet";
import { Disclaimer } from "./../Disclaimer";
import { Option } from "./../Option";
import { Popup } from "./../Popup";
import { WalletList } from "./../WalletList";
import { testData } from "@/utils/unit-tests/test-data";
import { wallets } from "@/lib/connect-wallet/config/wallets.js";

describe("ConnectWallet component", () => {
  const onLogin = jest.fn(() => {});
  const onLogout = jest.fn(() => {});
  beforeEach(() => {
    i18n.activate("en");
    mockFn.useAuth(() => ({
      login: onLogin,
      logout: onLogout,
    }));

    const { initialRender } = initiateTest(() => (
      <ConnectWallet
        networkId={testData.network.networkId}
        notifier={jest.fn(() => {})}
      >
        {({ onOpen, logout }) => (
          <div>
            <button onClick={onOpen} data-testid="onOpen">
              on open
            </button>
            <button onClick={logout} data-testid="logout">
              logout
            </button>
          </div>
        )}
      </ConnectWallet>
    ));

    initialRender();
  });

  test("Should render component", () => {
    const onOpenButton = screen.getByTestId("onOpen");
    const onLogoutButton = screen.getByTestId("logout");

    expect(onOpenButton).toBeInTheDocument();
    expect(onLogoutButton).toBeInTheDocument();

    fireEvent.click(onLogoutButton);

    expect(onLogout).toBeCalled();

    expect(screen.queryByText(/Connect Wallet/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Close/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/By connecting a wallet, you agree to Neptune Mutual/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Protocol Disclaimer/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Install Binance Wallet/i)
    ).not.toBeInTheDocument();
  });

  test("Should show Modal", () => {
    const onOpenButton = screen.getByTestId("onOpen");

    expect(onOpenButton).toBeInTheDocument();

    fireEvent.click(onOpenButton);

    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
    expect(screen.getByText(/Close/i)).toBeInTheDocument();
    expect(
      screen.getByText(/By connecting a wallet, you agree to Neptune Mutual/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Protocol Disclaimer/i)).toBeInTheDocument();
    expect(screen.getByText(/MetaMask/i)).toBeInTheDocument();
    expect(screen.getByText(/Install Binance Wallet/i)).toBeInTheDocument();
  });
});

describe("Disclaimer Component", () => {
  beforeEach(() => {
    i18n.activate("en");

    const { initialRender } = initiateTest(Disclaimer);

    initialRender();
  });

  test("Show Disclaimer Modal", () => {
    expect(
      screen.getByText(/By connecting a wallet, you agree to Neptune Mutual/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Protocol Disclaimer/i)).toBeInTheDocument();
  });
});

describe("Option Component", () => {
  beforeEach(() => {
    i18n.activate("en");
  });

  test("Metamask: Show button", () => {
    const metamask = wallets[0];
    const { initialRender } = initiateTest(() => <Option {...metamask} />);

    initialRender();
    expect(screen.getByText(metamask.name)).toBeInTheDocument();
  });

  test("MetaMask Show Install Link", () => {
    const metamask = wallets[0];
    global.web3 = undefined;
    global.ethereum = undefined;
    const { initialRender } = initiateTest(() => <Option {...metamask} />);

    initialRender();
    expect(screen.getByText(/Install Metamask/i)).toBeInTheDocument();
  });

  test("Binance: Show Button", () => {
    const binance = wallets[1];
    global.BinanceChain = {};
    const { initialRender } = initiateTest(() => <Option {...binance} />);

    initialRender();
    expect(screen.getByText(binance.name)).toBeInTheDocument();
  });

  test("Binance: Show Install Link", () => {
    const metamask = wallets[1];
    global.BinanceChain = undefined;
    const { initialRender } = initiateTest(() => <Option {...metamask} />);

    initialRender();
    expect(screen.getByText(/Install Binance Wallet/i)).toBeInTheDocument();
  });
});

describe("Popup Component", () => {
  const onClose = jest.fn(() => {});
  const notifier = jest.fn(() => {});
  beforeEach(() => {
    i18n.activate("en");
  });

  test("Show Popup Modal", () => {
    const { initialRender } = initiateTest(() => (
      <Popup
        isOpen={true}
        onClose={onClose}
        networkId={testData.network.networkId}
        notifier={notifier}
      />
    ));

    initialRender();

    const closeButton = screen.getByText(/Close/i);

    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(
      screen.getByText(/By connecting a wallet, you agree to Neptune Mutual/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Terms & Conditions/i)).toBeInTheDocument();
    expect(screen.getByText(/Protocol Disclaimer/i)).toBeInTheDocument();
    expect(screen.getByText(/MetaMask/i)).toBeInTheDocument();
    expect(screen.getByText(/Install Binance Wallet/i)).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(onClose).toBeCalled();
  });

  test("Hide Popup Modal", () => {
    const { initialRender } = initiateTest(() => (
      <Popup
        isOpen={false}
        onClose={onClose}
        networkId={testData.network.networkId}
        notifier={notifier}
      />
    ));

    initialRender();

    expect(screen.queryByText(/Connect Wallet/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Close/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/By connecting a wallet, you agree to Neptune Mutual/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Terms & Conditions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Protocol Disclaimer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/MetaMask/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Install Binance Wallet/i)
    ).not.toBeInTheDocument();
  });
});

describe("WalletList Component", () => {
  const onConnect = jest.fn(() => {});
  beforeEach(() => {
    i18n.activate("en");

    const { initialRender } = initiateTest(() => (
      <WalletList wallets={wallets} onConnect={onConnect} />
    ));

    initialRender();
  });

  test("Show WalletList Component", () => {
    const metamaskButton = screen.getByText(/MetaMask/i);
    const binanceButton = screen.getByText(/Install Binance Wallet/i);
    expect(metamaskButton).toBeInTheDocument();
    expect(binanceButton).toBeInTheDocument();

    fireEvent.click(metamaskButton);

    waitFor(() => {
      expect(onConnect).toBeCalled();
    });

    fireEvent.click(binanceButton);

    waitFor(() => {
      expect(onConnect).toBeCalled();
    });
  });
});
