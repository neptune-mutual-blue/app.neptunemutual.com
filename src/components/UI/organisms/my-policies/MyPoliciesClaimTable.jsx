import {
  Table,
  TBody,
  TableWrapper,
  THead,
} from "@/components/UI/organisms/Table";
import { classNames } from "@/utils/classnames";
import { getAvailableClaim } from "@/src/_mocks/policy/claim";
import { ClaimCoverModal } from "@/components/UI/organisms/my-policies/ClaimCoverModal";
import { useState, Fragment } from "react";

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
  <td className="px-6 py-6 text-404040">{row.address}</td>
);

const renderClaimBefore = (row) => (
  <td className="px-6 py-6">
    <span className="text-left whitespace-nowrap text-black">
      {row.claimBefore}
    </span>
  </td>
);

const renderAmount = (row) => (
  <td className="px-6 py-6 text-right">
    <span className="text-black">
      {row.amount} {row.unit}
    </span>
  </td>
);

const renderActions = (row) => {
  return <ClaimActionsColumnRenderer row={row} />;
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

export const MyPoliciesClaimTable = () => {
  const claimData = getAvailableClaim();

  return (
    <>
      <TableWrapper>
        <Table>
          <THead columns={columns}></THead>
          <TBody columns={columns} data={claimData}></TBody>
        </Table>
      </TableWrapper>
    </>
  );
};

const ClaimActionsColumnRenderer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    setIsOpen(true);
  };

  return (
    <td className="text-right px-6 py-6" style={{ minWidth: "120px" }}>
      <button
        className="text-4e7dd9 hover:underline cursor-pointer"
        onClick={handleClaim}
      >
        Claim
      </button>

      <ClaimCoverModal
        isOpen={isOpen}
        onClose={onClose}
        modalTitle="Claim Cover"
      />
    </td>
  );
};
