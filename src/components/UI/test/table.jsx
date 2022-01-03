import { transactionData as tableData } from "@/src/_mocks/policy/transaction";

import TimerIcon from "public/_mocks/icons/timer";
import LaunchIcon from "public/_mocks/icons/launch";
import PlusIcon from "public/_mocks/icons/plusIcon";

const columns = [
  {
    name: "WHEN",
    align: "left",
  },
  {
    name: "DETAILS",
    align: "left",
  },
  {
    name: "AMOUNT",
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
            <td className="px-6">{data.when}</td>
            <td className="text-left py-4 px-6 whitespace-nowrap">
              <td className="">{data.details.icon}</td>
              <td className="pl-4">{data.details.info}</td>
            </td>
            <td className="py-4 px-6 text-right flex items-center justify-end whitespace-nowrap">
              <td
                className={`${data.amount.red ? "text-FA5C2F" : "text-404040"}`}
              >
                {data.amount.total}
              </td>
              <td
                className={`px-1 ${
                  data.amount.red ? "text-FA5C2F" : "text-404040"
                }`}
              >
                {data.amount.unit}
              </td>
              <td className="pl-4">
                {data.amount.plusIcon ? <PlusIcon /> : ""}
              </td>
            </td>
            <td className="py-4 px-6 text-right whitespace-nowrap">
              <td className="">{data.action.timer ? <TimerIcon /> : ""}</td>
              <td className="pl-4">
                {data.action.launch ? <LaunchIcon /> : ""}
              </td>
              <td>{data.action.claim ? "CLAIM" : ""}</td>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export const TableComponent = () => {
  return (
    <div className="flex flex-col mx-10 mb-10">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden sm:rounded-t-3xl">
            <table className="min-w-full">
              <thead className="bg-black text-white rounded-sm">
                <tr className="">
                  {columns.map((col, idx) => {
                    return (
                      <th
                        key={idx}
                        scope="col"
                        className={`text-left py-6 px-6 font-bold text-sm  ${
                          col.align === "right" ? "text-right" : "text-left"
                        }`}
                      >
                        {col.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <TableBody />
              <tfoot></tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
