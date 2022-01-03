import CoinbaseIcon from "public/_mocks/icons/coinbase";
import AxieInfinityIcon from "public/_mocks/icons/axieInfinity";
import ClearpoolIcon from "public/_mocks/icons/clearpool";
import HexTrustIcon from "public/_mocks/icons/hexTrust";
import HuobiIcon from "public/_mocks/icons/huobi";
import OkexIcon from "public/_mocks/icons/okex";

export const transactionData = [
  {
    when: "few seconds ago",
    details: {
      showIcon: true,
      icon: <CoinbaseIcon />,
      info: "Purschased $250.000.45 Coinbase Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
      red: false,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "4 Minutes ago",
    details: {
      showIcon: true,
      icon: <OkexIcon />,
      info: "Purchased $3,256,350 OKEX Policy",
    },
    amount: {
      total: "2,154,355.34",
      unit: "cxDAI",
      plusIcon: true,
      red: false,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "30 Minutes ago",
    details: {
      showIcon: true,
      icon: <ClearpoolIcon />,
      info: "Claimed $33,418.33 Clearpool Policy",
    },
    amount: {
      total: "50,754.12",
      unit: "cxDAI",
      plusIcon: true,
      red: true,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "13 hours ago",
    details: {
      showIcon: true,
      icon: <CoinbaseIcon />,
      info: "Purschased $250.000.45 Coinbase Policy",
    },
    amount: {
      total: "26,764.55",
      unit: "cxDAI",
      plusIcon: true,
      red: false,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "a day ago",
    details: {
      showIcon: true,
      icon: <HuobiIcon />,
      info: "Purchased $299,999.8 Huobi Polciy",
    },
    amount: {
      total: "178,756.71",
      unit: "cxDAI",
      plusIcon: true,
      red: false,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "a day ago",
    details: {
      showIcon: true,
      icon: <AxieInfinityIcon />,
      info: "Purchased $299,999.8 Axie Infinity Policy",
    },
    amount: {
      total: "46,849.77",
      unit: "cxDAI",
      plusIcon: true,
      red: false,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "3 days ago",
    details: {
      showIcon: true,
      icon: <HexTrustIcon />,
      info: "Purchased $299,999.8 Hex Trust Policy",
    },
    amount: {
      total: "969,756.77",
      unit: "cxDAI",
      plusIcon: true,
      red: true,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "3 days ago",
    details: {
      showIcon: true,
      icon: <HuobiIcon />,
      info: "Claimed $299,999.8 Huobi Policy",
    },
    amount: {
      total: "46,849.77",
      unit: "cxDAI",
      plusIcon: true,
      red: false,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "3 days ago",
    details: {
      showIcon: true,
      icon: <CoinbaseIcon />,
      info: "Purchased $299,999.8 Coinbase Policy",
    },
    amount: {
      total: "178,756.71",
      unit: "cxDAI",
      plusIcon: true,
      red: false,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
  {
    when: "3 days ago",
    details: {
      showIcon: true,
      icon: <OkexIcon />,
      info: "Purchased $299,999.8 OKEX Policy",
    },
    amount: {
      total: "178,756.71",
      unit: "cxDAI",
      plusIcon: true,
      red: false,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
];