import * as Tooltip from "@radix-ui/react-tooltip";
import { useLiquidityTxs } from "@/src/hooks/useLiquidityTxs";
import {
  Table,
  TableShowMore,
  TableWrapper,
  TBody,
  THead,
} from "@/common/Table/Table";
import AddCircleIcon from "@/icons/AddCircleIcon";
import ClockIcon from "@/icons/ClockIcon";
import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { convertFromUnits } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatCurrency } from "@/utils/formatter/currency";
import { useNetwork } from "@/src/context/Network";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { usePagination } from "@/src/hooks/usePagination";
import { useAppConstants } from "@/src/context/AppConstants";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { Fragment } from "react";
import { CoverAvatar } from "@/common/CoverAvatar";
import { TokenAmountSpan } from "@/common/TokenAmountSpan";

const renderHeader = (col) => (
  <th
    scope="col"
    className={classNames(
      `px-6 py-6 font-bold text-sm uppercase whitespace-nowrap`,
      col.align === "right" ? "text-right" : "text-left"
    )}
  >
    {col.name}
  </th>
);

const renderWhen = (row) => <WhenRenderer row={row} />;

const renderDetails = (row) => <DetailsRenderer row={row} />;

const renderAmount = (row) => <PodAmountRenderer row={row} />;

const renderActions = (row) => <ActionsRenderer row={row} />;

export const columns = [
  {
    name: t`when`,
    align: "left",
    renderHeader,
    renderData: renderWhen,
  },
  {
    name: t`details`,
    align: "left",
    renderHeader,
    renderData: renderDetails,
  },
  {
    name: t`amount`,
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

export const MyLiquidityTxsTable = () => {
  const { page, limit, setPage } = usePagination();
  const { data, loading, hasMore } = useLiquidityTxs({
    page,
    limit,
  });

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  const { blockNumber, transactions } = data;
  return (
    <>
      {blockNumber && (
        <p
          className="mb-8 text-xs font-semibold text-right text-9B9B9B"
          data-testid="block-number"
        >
          <Trans>LAST SYNCED:</Trans>{" "}
          <a
            href={getBlockLink(networkId, blockNumber)}
            target="_blank"
            rel="noreferrer noopener nofollow"
            className="pl-1 text-4e7dd9"
          >
            #{blockNumber}
          </a>
        </p>
      )}
      <TableWrapper data-testid="table-wrapper">
        <Table>
          <THead columns={columns} data-testid="table-head" />
          {account ? (
            <TBody isLoading={loading} columns={columns} data={transactions} />
          ) : (
            <tbody data-testid="no-account-message">
              <tr className="w-full text-center">
                <td className="p-6" colSpan={columns.length}>
                  <Trans>Please connect your wallet...</Trans>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
        {hasMore && (
          <TableShowMore
            isLoading={loading}
            onShowMore={() => {
              setPage((prev) => prev + 1);
            }}
          />
        )}
      </TableWrapper>
    </>
  );
};

const WhenRenderer = ({ row }) => {
  const router = useRouter();

  return (
    <td
      className="max-w-xs px-6 py-6 whitespace-nowrap"
      title={DateLib.toLongDateFormat(row.transaction.timestamp, router.locale)}
    >
      {fromNow(row.transaction.timestamp)}
    </td>
  );
};

const DetailsRenderer = ({ row }) => {
  const productKey = safeFormatBytes32String("");
  const coverInfo = useCoverOrProductData({
    coverKey: row.cover.id,
    productKey: productKey,
  });
  const router = useRouter();
  const { liquidityTokenDecimals } = useAppConstants();
  const isDiversified = coverInfo?.supportsProducts;

  if (!coverInfo) {
    return null;
  }

  return (
    <td className="max-w-sm px-6 py-6">
      <div className="flex items-center w-max">
        <CoverAvatar
          coverInfo={coverInfo}
          isDiversified={isDiversified}
          containerClass="grow-0"
          diversifiedContainerClass="lg:w-8"
          liquidityTxTable={true}
        />
        <span className="pl-4 text-left whitespace-nowrap">
          {row.type == "PodsIssued" ? (
            <Trans>
              Added{" "}
              <TokenAmountSpan
                amountInUnits={row.liquidityAmount}
                decimals={liquidityTokenDecimals}
              />{" "}
              to{" "}
              {isDiversified
                ? coverInfo.infoObj.coverName
                : coverInfo.infoObj.projectName}
            </Trans>
          ) : (
            <Trans>
              Removed{" "}
              <TokenAmountSpan
                amountInUnits={row.liquidityAmount}
                decimals={liquidityTokenDecimals}
              />{" "}
              from{" "}
              {isDiversified
                ? coverInfo.infoObj.coverName
                : coverInfo.infoObj.projectName}
            </Trans>
          )}
        </span>
      </div>
    </td>
  );
};

const PodAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken();
  const tokenSymbol = row.vault.tokenSymbol;
  const tokenDecimals = row.vault.tokenDecimals;

  const router = useRouter();

  return (
    <td className="max-w-sm px-6 py-6 text-right">
      <div className="flex items-center justify-end whitespace-nowrap w-max">
        <span
          className={row.type == "PodsIssued" ? "text-404040" : "text-FA5C2F"}
          title={
            formatCurrency(
              convertFromUnits(row.podAmount, tokenDecimals),
              router.locale,
              tokenSymbol,
              true
            ).long
          }
        >
          {
            formatCurrency(
              convertFromUnits(row.podAmount, tokenDecimals),
              router.locale,
              tokenSymbol,
              true
            ).short
          }
        </span>
        <button
          className="p-1 ml-3"
          onClick={() => register(row.vault.id, tokenSymbol, tokenDecimals)}
          title="Add to Metamask"
        >
          <span className="sr-only">Add to metamask</span>
          <AddCircleIcon className="w-4 h-4" />
        </button>
      </div>
    </td>
  );
};

const ActionsRenderer = ({ row }) => {
  const { networkId } = useNetwork();
  const router = useRouter();

  return (
    <td className="px-6 py-6 min-w-120">
      <div className="flex items-center justify-end">
        {/* Tooltip */}
        <Tooltip.Root>
          <Tooltip.Trigger className="p-1 mr-4 text-9B9B9B">
            <span className="sr-only">Timestamp</span>
            <ClockIcon className="w-4 h-4" />
          </Tooltip.Trigger>

          <Tooltip.Content side="top">
            <div className="max-w-sm p-3 text-sm leading-6 text-white bg-black rounded-xl">
              <p>
                {DateLib.toLongDateFormat(
                  row.transaction.timestamp,
                  router.locale,
                  "UTC"
                )}
              </p>
            </div>
            <Tooltip.Arrow offset={16} className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Root>

        <a
          href={getTxLink(networkId, { hash: row.transaction.id })}
          target="_blank"
          rel="noreferrer noopener nofollow"
          className="p-1 text-black"
          title="Open in Explorer"
        >
          <span className="sr-only">Open in explorer</span>
          <OpenInNewIcon className="w-4 h-4" />
        </a>
      </div>
    </td>
  );
};
