import * as Tooltip from "@radix-ui/react-tooltip";
import { usePolicyTxs } from "@/src/hooks/usePolicyTxs";
import {
  Table,
  TableWrapper,
  TBody,
  THead,
} from "@/src/common/components/Table";
import AddCircleIcon from "@/icons/AddCircleIcon";
import ClockIcon from "@/icons/ClockIcon";
import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { convertFromUnits } from "@/utils/bn";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatCurrency } from "@/utils/formatter/currency";
import { useNetwork } from "@/src/context/Network";

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

const renderWhen = (row) => (
  <td
    className="px-6 py-6"
    title={DateLib.toLongDateFormat(row.transaction.timestamp)}
  >
    {fromNow(row.transaction.timestamp)}
  </td>
);

const renderDetails = (row) => <DetailsRenderer row={row} />;

const renderAmount = (row) => <CxDaiAmountRenderer row={row} />;

const renderActions = (row) => <ActionsRenderer row={row} />;

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
  const { data, loading } = usePolicyTxs();

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  const { blockNumber, transactions } = data;

  return (
    <>
      {blockNumber && (
        <p className="mb-8 text-xs font-semibold text-right text-9B9B9B">
          LAST SYNCED:{" "}
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
      <TableWrapper>
        <Table>
          <THead columns={columns}></THead>
          {account ? (
            <TBody
              isLoading={loading}
              columns={columns}
              data={transactions}
            ></TBody>
          ) : (
            <tbody>
              <tr className="w-full text-center">
                <td className="p-6" colSpan={columns.length}>
                  Please connect your wallet...
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </TableWrapper>
    </>
  );
};

const DetailsRenderer = ({ row }) => {
  const { coverInfo } = useCoverInfo(row.cover.id);

  return (
    <td className="px-6 py-6">
      <div className="flex items-center">
        <img
          src={getCoverImgSrc({ key: row.cover.id })}
          alt="policy"
          height={32}
          width={32}
        />

        <span className="pl-4 text-left whitespace-nowrap">
          {row.type == "CoverPurchased" ? "Purchased" : "Claimed"}{" "}
          <span title={formatCurrency(convertFromUnits(row.daiAmount)).long}>
            {formatCurrency(convertFromUnits(row.daiAmount)).short}
          </span>{" "}
          {coverInfo.projectName} policy
        </span>
      </div>
    </td>
  );
};

const CxDaiAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken();
  const tokenSymbol = useTokenSymbol(row.cxToken);

  return (
    <td className="px-6 py-6 text-right">
      <div className="flex items-center justify-end whitespace-nowrap">
        <span
          className={
            row.type == "CoverPurchased" ? "text-404040" : "text-FA5C2F"
          }
          title={
            formatCurrency(
              convertFromUnits(row.cxTokenAmount),
              tokenSymbol,
              true
            ).long
          }
        >
          {
            formatCurrency(
              convertFromUnits(row.cxTokenAmount),
              tokenSymbol,
              true
            ).short
          }
        </span>
        <button
          className="p-1 ml-3"
          onClick={() => register(row.cxToken, tokenSymbol)}
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
                {DateLib.toLongDateFormat(row.transaction.timestamp, "UTC")}
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
