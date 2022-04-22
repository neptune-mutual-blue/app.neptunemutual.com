import ChevronLeftLgIcon from "@/icons/ChevronLeftLgIcon";
import ChevronRightLgIcon from "@/icons/ChevronRightLgIcon";
import { Fragment } from "react";
import { t, Trans } from "@lingui/macro";

export const Table = ({ children }) => {
  return <table className="min-w-full">{children}</table>;
};

export const TableWrapper = ({ children }) => {
  return (
    <>
      <div className="relative overflow-x-scroll bg-white text-404040 rounded-3xl lg:overflow-hidden">
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
      <div className="flex items-center justify-end w-full p-4 border-t border-t-DAE2EB">
        <p className="p-2 opacity-40">
          <Trans>Rows per page</Trans>
        </p>
        <select
          className="mx-4 rounded-lg"
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
    <thead className="text-white bg-black rounded-sm">
      <tr>
        {columns.map((col, idx) => {
          return <Fragment key={idx}>{col.renderHeader(col)}</Fragment>;
        })}
      </tr>
    </thead>
  );
};

// RowWrapper can probably only be a "Context Provider"
export const TBody = ({
  columns,
  data,
  isLoading,
  extraData,
  RowWrapper = Fragment,
}) => {
  return (
    <tbody className="divide-y divide-DAE2EB">
      {data.length === 0 && (
        <tr className="w-full text-center">
          <td className="p-6" colSpan={columns.length}>
            {isLoading ? t`Loading...` : t`No data found`}
          </td>
        </tr>
      )}
      {data.map((row, idx) => {
        const wrapperProps = RowWrapper === Fragment ? {} : { row, extraData };

        return (
          <RowWrapper key={idx} {...wrapperProps}>
            <tr>
              {columns.map((col, _idx) => {
                return (
                  <Fragment key={_idx}>
                    {col.renderData(row, extraData)}
                  </Fragment>
                );
              })}
            </tr>
          </RowWrapper>
        );
      })}
    </tbody>
  );
};
