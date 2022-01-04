export const Option = (props) => {
  const { id, name, Icon, onClick } = props;

  if (name.toLowerCase() == "metamask") {
    if (!(window.web3 || window.ethereum)) {
      return (
        <a
          href="https://metamask.io/"
          target="_blank"
          rel="noreferrer noopener"
          className="w-full flex items-center py-4 px-6 mb-4 bg-white border border-d4dfee rounded-lg focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9"
        >
          <Icon className="mr-6" width={24} />
          <p>Install Metamask</p>
        </a>
      );
    }
  }

  if (name.toLowerCase() == "binance chain wallet") {
    if (!window.BinanceChain) {
      return (
        <a
          href="https://docs.binance.org/smart-chain/wallet/binance.html"
          target="_blank"
          rel="noreferrer noopener"
          className="w-full flex items-center py-4 px-6 mb-4 bg-white border border-d4dfee rounded-lg focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9"
        >
          <Icon className="mr-6" width={24} />
          <p>Install Binance Wallet</p>
        </a>
      );
    }
  }

  return (
    <button
      key={id}
      onClick={onClick}
      type="button"
      className="w-full flex items-center py-4 px-6 mb-4 bg-white border border-d4dfee rounded-lg focus:border-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9"
    >
      <Icon className="mr-6" width={24} />
      <p>{name}</p>
    </button>
  );
};
