import * as Tooltip from "@radix-ui/react-tooltip";
import { usePolicyTxs } from "@/components/UI/organisms/my-policies/usePolicyTxs";
import {
  Table,
  TableWrapper,
  TBody,
  THead,
} from "@/components/UI/organisms/Table";
import AddCircleIcon from "@/icons/AddCircleIcon";
import ClockIcon from "@/icons/ClockIcon";
import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { convertFromUnits } from "@/utils/bn";
import { formatTime, unixToDate } from "@/utils/date";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useCoverInfo } from "@/components/pages/cover/useCoverInfo";

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
  <td className="px-6 py-6">{formatTime(row.transaction.timestamp)}</td>
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
  const { account, chainId } = useWeb3React();

  const { blockNumber, transactions } = data;

  return (
    <>
      {blockNumber && (
        <p className="text-9B9B9B text-xs text-right font-semibold mb-8">
          LAST SYNCED:{" "}
          <a
            href={getBlockLink(chainId, blockNumber)}
            target="_blank"
            rel="noreferrer noopener"
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
          {row.type == "CoverPurchase" ? "Purchased" : "Claimed"} $
          {convertFromUnits(row.daiAmount).decimalPlaces(2).toString()}{" "}
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
            row.type == "CoverPurchase" ? "text-404040" : "text-FA5C2F"
          }
        >
          {convertFromUnits(row.daiAmount).decimalPlaces(2).toString()}{" "}
          {tokenSymbol}
        </span>
        <button
          className="ml-3 p-1"
          onClick={() => register(row.cxToken, tokenSymbol)}
        >
          <span className="sr-only">Add to metamask</span>
          <AddCircleIcon className="h-4 w-4" />
        </button>
      </div>
    </td>
  );
};

const ActionsRenderer = ({ row }) => {
  const { chainId } = useWeb3React();

  return (
    <td className="px-6 py-6" style={{ minWidth: "120px" }}>
      <div className="flex items-center justify-end">
        {/* Tooltip */}
        <Tooltip.Root>
          <Tooltip.Trigger className="p-1 mr-4 text-9B9B9B">
            <span className="sr-only">Timestamp</span>
            <ClockIcon className="h-4 w-4" />
          </Tooltip.Trigger>

          <Tooltip.Content side="top">
            <div className="text-sm leading-6 bg-black text-white p-3 rounded-xl max-w-sm">
              <p>
                {unixToDate(row.transaction.timestamp, "YYYY/MM/DD HH:mm") +
                  " UTC"}
              </p>
            </div>
            <Tooltip.Arrow offset={16} className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Root>

        <a
          href={getTxLink(chainId, { hash: row.transaction.id })}
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
