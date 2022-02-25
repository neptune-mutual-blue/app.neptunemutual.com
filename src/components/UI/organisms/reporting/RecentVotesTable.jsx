import {
  Table,
  TableWrapper,
  TBody,
  THead,
} from "@/components/UI/organisms/Table";
import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { classNames } from "@/utils/classnames";
import { convertFromUnits } from "@/utils/bn";
import { useAppContext } from "@/src/context/AppWrapper";
import { useRecentVotes } from "@/src/hooks/useRecentVotes";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatCurrency } from "@/utils/formatter/currency";

const renderHeader = (col) => (
  <th
    scope="col"
    className={classNames(
      `px-6 py-6 font-bold text-sm tracking-wider uppercase`,
      col.align === "right" ? "text-right" : "text-left"
    )}
  >
    {col.name}
  </th>
);

const renderWhen = (row) => (
  <td
    className="px-6 py-6"
    title={DateLib.toLongDateFormat(row.transaction.timestamp)}
  >
    {fromNow(row.transaction.timestamp)}
  </td>
);

const renderAccount = (row) => (
  <td className="px-6 py-6">
    <span className="whitespace-nowrap">{row.witness}</span>
  </td>
);

const renderAmount = (row) => <AmountRenderer row={row} />;

const renderActions = (row) => <ActionsRenderer row={row} />;

const columns = [
  {
    name: "when",
    align: "left",
    renderHeader,
    renderData: renderWhen,
  },
  {
    name: "account",
    align: "left",
    renderHeader,
    renderData: renderAccount,
  },
  {
    name: "vote/stake",
    align: "left",
    renderHeader,
    renderData: renderAmount,
  },
  {
    name: "",
    align: "right",
    renderHeader,
    renderData: renderActions,
  },
];

export const RecentVotesTable = ({ coverKey, incidentDate }) => {
  const { data, loading } = useRecentVotes({ coverKey, incidentDate });

  const { transactions } = data;

  return (
    <>
      <h3 className="text-h4 font-sora font-bold mt-14 mb-6">Recent Votes</h3>

      <TableWrapper>
        <Table>
          <THead columns={columns}></THead>
          <TBody
            isLoading={loading}
            columns={columns}
            data={transactions}
          ></TBody>
        </Table>
      </TableWrapper>
    </>
  );
};

const AmountRenderer = ({ row }) => {
  return (
    <td className="px-6 py-6">
      <div className="flex items-center whitespace-nowrap">
        <div
          className={classNames(
            "w-4 h-4 mr-4 rounded",
            row.voteType === "Attested" ? "bg-21AD8C" : "bg-FA5C2F"
          )}
        ></div>
        <div
          title={formatCurrency(convertFromUnits(row.stake), "NPM", true).long}
        >
          {formatCurrency(convertFromUnits(row.stake), "NPM", true).short}
        </div>
      </div>
    </td>
  );
};

const ActionsRenderer = ({ row }) => {
  const { networkId } = useAppContext();

  return (
    <td className="px-6 py-6 min-w-60">
      <div className="flex items-center justify-end">
        <a
          href={getTxLink(networkId, { hash: row.transaction.id })}
          target="_blank"
          rel="noreferrer noopener"
          className="p-1 text-black"
        >
          <span className="sr-only">Open in explorer</span>
          <OpenInNewIcon className="h-4 w-4" />
        </a>
      </div>
    </td>
  );
};
