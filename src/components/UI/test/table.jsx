import CoinbaseIcon from "public/_mocks/icons/coinbase";
import AxieInfinityIcon from "public/_mocks/icons/axieInfinity";
import ClearpoolIcon from "public/_mocks/icons/clearpool";
import HexTrustIcon from "public/_mocks/icons/hexTrust";
import HuobiIcon from "public/_mocks/icons/huobi";
import OkexIcon from "public/_mocks/icons/okex";
import TimerIcon from "public/_mocks/icons/timer";
import LaunchIcon from "public/_mocks/icons/launch";

const tableData = [
  {
    when: "few seconds ago",
    details: {
      icon: <CoinbaseIcon />,
      info: "Purschased $250.000.45 Coinbase Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <OkexIcon />,
      info: "Purchased $3,256,350 OKEX Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <ClearpoolIcon />,
      info: "Claimed $33,418.33 Clearpool Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <CoinbaseIcon />,
      info: "Purschased $250.000.45 Coinbase Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <HuobiIcon />,
      info: "Purchased $299,999.8 Huobi Polciy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <AxieInfinityIcon />,
      info: "Purchased $299,999.8 Axie Infinity Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <HexTrustIcon />,
      info: "Purchased $299,999.8 Hex Trust Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <HuobiIcon />,
      info: "Claimed $299,999.8 Huobi Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <CoinbaseIcon />,
      info: "Purchased $299,999.8 Coinbase Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
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
      icon: <OkexIcon />,
      info: "Purchased $299,999.8 OKEX Policy",
    },
    amount: {
      total: "189,595.93",
      unit: "cxDAI",
      plusIcon: true,
    },
    action: {
      timer: true,
      launch: true,
      claim: false,
    },
  },
];

const columns = ["WHEN", "DETAILS", "AMOUNT", ""];

export const TableComponent = () => {
  return (
    <div>
      <table>
        <thead>
          {columns.map((col, idx) => {
            return <th key={idx}>{col}</th>;
          })}
        </thead>
        <tbody></tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
};
