import ChevronLeftLgIcon from "@/icons/ChevronLeftLgIcon";
import ChevronRightLgIcon from "@/icons/ChevronRightLgIcon";
import { Fragment } from "react";

export const Table = ({ children }) => {
  return <table className="min-w-full">{children}</table>;
};

export const TableWrapper = ({ children }) => {
  return (
    <>
      <div className="bg-white text-404040 rounded-3xl overflow-x-scroll lg:overflow-hidden">
        {children}
      </div>
    </>
  );
};

export const TablePagination = ({
  skip = 5,
  limit = 10,
  totalCount = 124,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
  updateRowCount,
}) => {
  if (totalCount <= 0) {
    return null;
  }

  return (
    <>
      <div className="w-full flex justify-end items-center p-4 border-t border-t-DAE2EB">
        <p className="p-2 opacity-40">Rows per page</p>
        <select
          className="rounded-lg mx-4"
          value={limit.toString()}
          onChange={(ev) => updateRowCount(ev.target.value)}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <p className="p-2 opacity-40">
          {skip + 1}-{Math.min(skip + limit, totalCount)} of {totalCount}
        </p>
        <button
          className="p-2 mx-2 disabled:opacity-25 disabled:cursor-not-allowed"
          onClick={onPrev}
          disabled={!hasPrev}
        >
          <ChevronLeftLgIcon width={16} height={16} />
        </button>
        <button
          className="p-2 disabled:opacity-25 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={!hasNext}
        >
          <ChevronRightLgIcon width={16} height={16} />
        </button>
      </div>
    </>
  );
};

export const THead = ({ columns }) => {
  return (
    <thead className="bg-black text-white rounded-sm">
      <tr>
        {columns.map((col, idx) => {
          return <Fragment key={idx}>{col.renderHeader(col)}</Fragment>;
        })}
      </tr>
    </thead>
  );
};

export const TBody = ({
  columns,
  data,
  isCoverClaimClickedFunc,
  isLoading,
}) => {
  const isClaimClicked = (isClicked) => {
    isCoverClaimClickedFunc(isClicked);
  };
  return (
    <tbody className="divide-y divide-DAE2EB">
      {data.length === 0 && (
        <tr className="w-full text-center">
          <td className="p-6" colSpan={columns.length}>
            {isLoading ? "Loading..." : "No data found"}
          </td>
        </tr>
      )}
      {data.map((row, idx) => {
        return (
          <tr key={idx}>
            {columns.map((col, _idx) => {
              return (
                <Fragment key={_idx}>
                  {col.renderData(row, isClaimClicked)}
                </Fragment>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};
