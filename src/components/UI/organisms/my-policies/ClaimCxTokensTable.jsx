import { useState } from "react";

import {
  Table,
  TBody,
  TableWrapper,
  THead,
} from "@/components/UI/organisms/Table";
import { classNames } from "@/utils/classnames";
import { ClaimCoverModal } from "@/components/UI/organisms/my-policies/ClaimCoverModal";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";

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

const renderAddress = (row) => (
  <td className="px-6 py-6 text-404040">{row.cxToken.id}</td>
);

const renderClaimBefore = (row) => (
  <td className="px-6 py-6">
    <span
      className="text-left whitespace-nowrap"
      title={DateLib.toLongDateFormat(row.expiresOn)}
    >
      {fromNow(row.expiresOn)}
    </span>
  </td>
);

const renderAmount = (row) => <CxTokenAmountRenderer row={row} />;

const renderActions = (row, extraData) => {
  return <ClaimActionsColumnRenderer row={row} extraData={extraData} />;
};

const columns = [
  {
    name: "cxToken Address",
    align: "left",
    renderHeader,
    renderData: renderAddress,
  },
  {
    name: "Claim before",
    align: "left",
    renderHeader,
    renderData: renderClaimBefore,
  },
  {
    name: "Amount",
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

export const ClaimCxTokensTable = ({
  activePolicies,
  coverKey,
  incidentDate,
}) => {
  return (
    <>
      <TableWrapper>
        <Table>
          <THead columns={columns}></THead>
          <TBody
            columns={columns}
            data={activePolicies}
            extraData={{ coverKey, incidentDate }}
          ></TBody>
        </Table>
      </TableWrapper>
    </>
  );
};

const CxTokenAmountRenderer = ({ row }) => {
  const tokenAddress = row.cxToken.id;
  const tokenSymbol = useTokenSymbol(tokenAddress);
  const { balance } = useERC20Balance(tokenAddress);

  return (
    <>
      <td className="px-6 py-6 text-right">
        <span
          title={
            formatCurrency(convertFromUnits(balance), tokenSymbol, true).long
          }
        >
          {formatCurrency(convertFromUnits(balance), tokenSymbol, true).short}
        </span>
      </td>
    </>
  );
};

const ClaimActionsColumnRenderer = ({ row, extraData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    setIsOpen(true);
  };

  return (
    <td className="text-right px-6 py-6 min-w-120">
      <button
        className="text-4e7dd9 hover:underline cursor-pointer"
        onClick={handleClaim}
      >
        Claim
      </button>

      <ClaimCoverModal
        data={row}
        coverKey={row.cover.id}
        cxTokenAddress={row.cxToken.id}
        isOpen={isOpen}
        onClose={onClose}
        modalTitle="Claim Cover"
        incidentDate={extraData.incidentDate}
      />
    </td>
  );
};
