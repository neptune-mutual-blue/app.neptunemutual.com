import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Table,
  TableWrapper,
  TBody,
  THead,
} from "@/components/UI/organisms/Table";
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
import { useBondTxs } from "@/src/hooks/useBondTxs";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { ROWS_PER_PAGE } from "@/src/config/constants";
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

const renderDetails = (row, extraData) => (
  <DetailsRenderer row={row} lpTokenAddress={extraData} />
);

const renderAmount = (row) => <BondAmountRenderer row={row} />;

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
  const { data, loading, isShowMoreVisible, handleShowMore } = useBondTxs({
    itemsToQuery: ROWS_PER_PAGE,
  });

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  const { blockNumber, transactions, lpTokenAddress } = data;

  return (
    <>
      {blockNumber && (
        <p className="mb-8 text-xs font-semibold text-right text-9B9B9B">
          LAST SYNCED:{" "}
          <a
            href={getBlockLink(networkId, blockNumber)}
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
              extraData={lpTokenAddress}
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
        {isShowMoreVisible && (
          <div className="flex justify-center p-5 border-t hover:bg-F4F8FC border-DAE2EB">
            <button className={"block w-full"} onClick={handleShowMore}>
              Show More
            </button>
          </div>
        )}
      </TableWrapper>
    </>
  );
};

const DetailsRenderer = ({ row, lpTokenAddress }) => {
  const liquidityTokenSymbol = useTokenSymbol(lpTokenAddress);
  return (
    <td className="px-6 py-6">
      <div className="flex items-center">
        <img src="/images/tokens/npm.svg" alt="npm" height={32} width={32} />
        <span className="pl-4 text-left whitespace-nowrap">
          {row.type === "BondCreated" ? "Bonded " : "Claimed "}
          <span
            title={
              formatCurrency(
                convertFromUnits(
                  row.type === "BondCreated"
                    ? row.lpTokenAmount
                    : row.claimAmount
                ),
                row.type === "BondCreated" ? liquidityTokenSymbol : "NPM",
                true
              ).long
            }
          >
            {
              formatCurrency(
                convertFromUnits(
                  row.type === "BondCreated"
                    ? row.lpTokenAmount
                    : row.claimAmount
                ),
                row.type === "BondCreated" ? liquidityTokenSymbol : "NPM",
                true
              ).short
            }
          </span>{" "}
        </span>
      </div>
    </td>
  );
};

const BondAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken();
  const { NPMTokenAddress } = useAppConstants();
  const npmTokenSymbol = useTokenSymbol(NPMTokenAddress);
  //add NPM token address
  return (
    <td className="px-6 py-6 text-right">
      <div className="flex items-center justify-end whitespace-nowrap">
        <span
          className={row.type == "BondCreated" ? "text-404040" : "text-FA5C2F"}
          title={
            formatCurrency(
              convertFromUnits(
                row.type == "BondCreated"
                  ? row.npmToVestAmount
                  : row.claimAmount
              ),
              "NPM",
              true
            ).long
          }
        >
          {
            formatCurrency(
              convertFromUnits(
                row.type == "BondCreated"
                  ? row.npmToVestAmount
                  : row.claimAmount
              ),
              "NPM",
              true
            ).short
          }
        </span>
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
          rel="noreferrer noopener"
          className="p-1 text-black"
        >
          <span className="sr-only">Open in explorer</span>
          <OpenInNewIcon className="w-4 h-4" />
        </a>
      </div>
    </td>
  );
};
