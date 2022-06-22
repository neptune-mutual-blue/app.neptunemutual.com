import * as Tooltip from "@radix-ui/react-tooltip";
import { usePolicyTxs } from "@/src/hooks/usePolicyTxs";
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
import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { convertFromUnits } from "@/utils/bn";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatCurrency } from "@/utils/formatter/currency";
import { useNetwork } from "@/src/context/Network";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { usePagination } from "@/src/hooks/usePagination";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";

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

const renderWhen = (row) => <WhenRenderer row={row} />;

const renderDetails = (row) => <DetailsRenderer row={row} />;

const renderAmount = (row) => <CxDaiAmountRenderer row={row} />;

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

export const MyPoliciesTxsTable = () => {
  const { page, limit, setPage } = usePagination();
  const { data, loading, hasMore } = usePolicyTxs({
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
      <TableWrapper data-testid="policy-txs-table-wrapper">
        <Table>
          <THead
            columns={columns}
            data-testid="policy-txs-table-header"
          ></THead>
          {account ? (
            <TBody
              isLoading={loading}
              columns={columns}
              data={transactions}
            ></TBody>
          ) : (
            <tbody data-testid="connect-wallet-tbody">
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
      className="px-6 py-6"
      title={DateLib.toLongDateFormat(row.transaction.timestamp, router.locale)}
      data-testid="timestamp-col"
    >
      {fromNow(row.transaction.timestamp)}
    </td>
  );
};

const DetailsRenderer = ({ row }) => {
  const productKey = safeFormatBytes32String("");
  const coverInfo = useCoverOrProductData({
    coverKey: row.cover.id,
    productKey,
  });
  const router = useRouter();

  if (!coverInfo) {
    return null;
  }

  return (
    <td className="px-6 py-6" data-testid="details-col">
      <div className="flex items-center">
        <img
          src={getCoverImgSrc({ key: row.cover.id })}
          alt={t`policy`}
          height={32}
          width={32}
        />

        <span className="pl-4 text-left whitespace-nowrap">
          {row.type == "CoverPurchased" ? t`Purchased` : t`Claimed`}{" "}
          <span
            title={
              formatCurrency(convertFromUnits(row.daiAmount), router.locale)
                .long
            }
          >
            {
              formatCurrency(convertFromUnits(row.daiAmount), router.locale)
                .short
            }
          </span>{" "}
          {coverInfo.projectName} <Trans>policy</Trans>
        </span>
      </div>
    </td>
  );
};

const CxDaiAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken();
  const tokenSymbol = row.cxTokenData.tokenSymbol;
  const router = useRouter();

  return (
    <td className="px-6 py-6 text-right" data-testid="col-amount">
      <div className="flex items-center justify-end whitespace-nowrap">
        <span
          className={
            row.type == "CoverPurchased" ? "text-404040" : "text-FA5C2F"
          }
          title={
            formatCurrency(
              convertFromUnits(row.cxTokenAmount),
              router.locale,
              tokenSymbol,
              true
            ).long
          }
        >
          {
            formatCurrency(
              convertFromUnits(row.cxTokenAmount),
              router.locale,
              tokenSymbol,
              true
            ).short
          }
        </span>
        <button
          className="p-1 ml-3"
          onClick={() => register(row.cxTokenData.id, tokenSymbol)}
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
    <td className="px-6 py-6 min-w-120" data-testid="col-actions">
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
        >
          <span className="sr-only">Open in explorer</span>
          <OpenInNewIcon className="w-4 h-4" />
        </a>
      </div>
    </td>
  );
};
