import { transactionData as tableData } from "@/src/_mocks/policy/transaction";

import { classNames } from "@/utils/classnames";
import AddCircleIcon from "@/icons/add-circle";
import ClockIcon from "@/icons/ClockIcon";
import OpenInNewIcon from "@/icons/open-in-new";
import ChevronLeftLgIcon from "@/icons/ChevronLeftLgIcon";
import ChevronRightLgIcon from "@/icons/ChevronRightLgIcon";

const columns = [
  {
    name: "when",
    align: "left",
  },
  {
    name: "details",
    align: "left",
  },
  {
    name: "amount",
    align: "right",
  },
  {
    name: "",
    align: "right",
  },
];

const TableBody = () => {
  return (
    <tbody className="divide-y divide-DAE2EB">
      {tableData.map((data, idx) => {
        return (
          <tr key={idx} className="text-404040">
            <td className="px-6 py-6">{data.timestamp}</td>
            <td className="px-6 py-6">
              <div className="flex items-center">
                <img
                  src={data.coverImgSrc}
                  alt="policy"
                  height={32}
                  width={32}
                />

                <span className="pl-4 text-left whitespace-nowrap">
                  {data.info}
                </span>
              </div>
            </td>
            <td className="px-6 py-6 text-right">
              <div className="flex items-center justify-end whitespace-nowrap">
                <span className={data.failed ? "text-FA5C2F" : "text-404040"}>
                  {data.amountRecieved} {data.unit}
                </span>
                <span className="pl-3">
                  <span className="sr-only">Add to metamask</span>
                  <AddCircleIcon className="h-4 w-4" />
                </span>
              </div>
            </td>
            <td className="px-6 py-6" style={{ minWidth: "120px" }}>
              <div className="flex items-center justify-end">
                <div className="mr-4 text-9B9B9B">
                  <span className="sr-only">History</span>
                  <ClockIcon className="h-4 w-4" />
                </div>
                <div className="text-black">
                  <span className="sr-only">Open in explorer</span>
                  <OpenInNewIcon className="h-4 w-4" />
                </div>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export const TableComponent = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-black text-white rounded-sm">
          <tr className="">
            {columns.map((col, idx) => {
              return (
                <th
                  key={idx}
                  scope="col"
                  className={classNames(
                    `px-6 py-6 font-bold text-sm uppercase`,
                    col.align === "right" ? "text-right" : "text-left"
                  )}
                >
                  {col.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <TableBody />
      </table>
      <div className="w-full flex justify-end items-center p-4 border-t border-t-DAE2EB">
        <TablePaginationFooter />
      </div>
    </div>
  );
};

const TablePaginationFooter = ({ skip = 5, limit = 10, totalCount = 124 }) => {
  return (
    <>
      <p className="p-2 opacity-40">Rows per page</p>
      <select className="rounded-lg mx-4">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
      <p className="p-2 opacity-40">
        {skip + 1}-{skip + limit} of {totalCount}
      </p>
      <button className="p-2 mx-2">
        <ChevronLeftLgIcon width={16} height={16} />
      </button>
      <button className="p-2">
        <ChevronRightLgIcon width={16} height={16} />
      </button>
    </>
  );
};
