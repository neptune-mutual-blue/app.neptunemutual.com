import {
  Table,
  TablePagination,
  TableWrapper,
  TBody,
  THead,
} from "@/components/UI/organisms/Table";
import OpenInNewIcon from "@/icons/open-in-new";
import { getVotesList } from "@/src/_mocks/reporting/votes";

import { classNames } from "@/utils/classnames";

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

const renderWhen = (row) => <td className="px-6 py-6">{row.timestamp}</td>;

const renderAccount = (row) => (
  <td className="px-6 py-6">
    <span className="whitespace-nowrap">{row.account}</span>
  </td>
);

const renderAmount = (row) => (
  <td className="px-6 py-6">
    <div className="flex items-center whitespace-nowrap">
      <div
        className={classNames(
          "w-4 h-4 mr-4 rounded",
          row.supportIncident ? "bg-21AD8C" : "bg-FA5C2F"
        )}
      ></div>
      <div>
        {row.amountStaked} {row.unit}
      </div>
    </div>
  </td>
);

const renderActions = (row) => (
  <td className="px-6 py-6" style={{ minWidth: "60px" }}>
    <div className="flex items-center justify-end">
      <a href={`https://example.com/${row.txHash}`} className="p-1 text-black">
        <span className="sr-only">Open in explorer</span>
        <OpenInNewIcon className="h-4 w-4" />
      </a>
    </div>
  </td>
);

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

export const RecentVotesTable = () => {
  const txsData = getVotesList();

  return (
    <>
      <h3 className="text-h4 font-sora font-bold mt-14 mb-6">Recent Votes</h3>

      <TableWrapper>
        <Table>
          <THead columns={columns}></THead>
          <TBody columns={columns} data={txsData}></TBody>
        </Table>
        <TablePagination />
      </TableWrapper>
    </>
  );
};
