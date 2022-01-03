import {
  Table,
  TablePagination,
  TableWrapper,
  TBody,
  THead,
} from "@/components/UI/organisms/Table";
import AddCircleIcon from "@/icons/add-circle";
import ClockIcon from "@/icons/ClockIcon";
import OpenInNewIcon from "@/icons/open-in-new";
import { getPolicyTxs } from "@/src/_mocks/policy/transaction";
import { classNames } from "@/utils/classnames";

const renderHeader = (col) => (
  <th
    scope="col"
    className={classNames(
      `px-6 py-6 font-bold text-sm uppercase`,
      col.align === "right" ? "text-right" : "text-left"
    )}
  >
    {col.name}
  </th>
);

const renderWhen = (row) => <td className="px-6 py-6">{row.timestamp}</td>;

const renderDetails = (row) => (
  <td className="px-6 py-6">
    <div className="flex items-center">
      <img src={row.coverImgSrc} alt="policy" height={32} width={32} />

      <span className="pl-4 text-left whitespace-nowrap">{row.info}</span>
    </div>
  </td>
);

const renderAmount = (row) => (
  <td className="px-6 py-6 text-right">
    <div className="flex items-center justify-end whitespace-nowrap">
      <span className={row.failed ? "text-FA5C2F" : "text-404040"}>
        {row.amountRecieved} {row.unit}
      </span>
      <button className="ml-3 p-1">
        <span className="sr-only">Add to metamask</span>
        <AddCircleIcon className="h-4 w-4" />
      </button>
    </div>
  </td>
);

const renderActions = (_row) => (
  <td className="px-6 py-6" style={{ minWidth: "120px" }}>
    <div className="flex items-center justify-end">
      <a href="#" className="p-1 mr-4 text-9B9B9B">
        <span className="sr-only">History</span>
        <ClockIcon className="h-4 w-4" />
      </a>
      <a href="#" className="p-1 text-black">
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
    name: "details",
    align: "left",
    renderHeader,
    renderData: renderDetails,
  },
  {
    name: "amount",
    align: "right",
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

export const MyPoliciesTxsTable = () => {
  const txsData = getPolicyTxs();

  return (
    <>
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
