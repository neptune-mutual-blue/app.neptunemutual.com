import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Table,
  TableWrapper,
  TBody,
  THead,
} from "@/common/components/Table/Table";
import AddCircleIcon from "@/icons/AddCircleIcon";
import ClockIcon from "@/icons/ClockIcon";
import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { useBondTxs } from "@/src/hooks/useBondTxs";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useNetwork } from "@/src/context/Network";
import { useBondInfo } from "@/src/hooks/useBondInfo";
import { TokenAmountSpan } from "@/src/common/components/TokenAmountSpan";

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

const renderDetails = (row, extraData) => (
  <DetailsRenderer row={row} lpTokenSymbol={extraData.lpTokenSymbol} />
);

const renderAmount = (row, extraData) => (
  <BondAmountRenderer row={row} npmTokenSymbol={extraData.npmTokenSymbol} />
);

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

export const MyBondTxsTable = () => {
  const { info } = useBondInfo();
  const { data, loading, hasMore, handleShowMore } = useBondTxs();

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  const { NPMTokenAddress } = useAppConstants();
  const npmTokenSymbol = useTokenSymbol(NPMTokenAddress);
  const lpTokenSymbol = useTokenSymbol(info.lpTokenAddress);

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
              extraData={{ npmTokenSymbol, lpTokenSymbol }}
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
        {hasMore && (
          <button
            disabled={loading}
            className={classNames(
              "block w-full p-5 border-t border-DAE2EB",
              !loading && "hover:bg-F4F8FC"
            )}
            onClick={handleShowMore}
          >
            {loading && transactions.length > 0 ? "loading..." : "Show More"}
          </button>
        )}
      </TableWrapper>
    </>
  );
};

const DetailsRenderer = ({ row, lpTokenSymbol }) => {
  return (
    <td className="px-6 py-6">
      <div className="flex items-center">
        <img src="/images/tokens/npm.svg" alt="npm" height={32} width={32} />
        <span className="pl-4 text-left whitespace-nowrap">
          {row.type === "BondCreated" ? "Bonded " : "Claimed "}
          <TokenAmountSpan
            amountInUnits={
              row.type === "BondCreated" ? row.lpTokenAmount : row.claimAmount
            }
            symbol={row.type === "BondCreated" ? lpTokenSymbol : "NPM"}
          />
        </span>
      </div>
    </td>
  );
};

const BondAmountRenderer = ({ row, npmTokenSymbol }) => {
  const { register } = useRegisterToken();
  const { NPMTokenAddress } = useAppConstants();

  return (
    <td className="px-6 py-6 text-right">
      <div className="flex items-center justify-end whitespace-nowrap">
        <TokenAmountSpan
          className={row.type == "BondCreated" ? "text-404040" : "text-FA5C2F"}
          amountInUnits={
            row.type == "BondCreated" ? row.npmToVestAmount : row.claimAmount
          }
          symbol={npmTokenSymbol}
        />
        <button
          className="p-1 ml-3"
          onClick={() => register(NPMTokenAddress, npmTokenSymbol)}
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
