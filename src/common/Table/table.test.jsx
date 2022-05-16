import React from "react";
import { render, screen } from "@/utils/unit-tests/test-utils";
import { Table, TBody, THead } from "@/common/Table/Table";
import { classNames } from "@/utils/classnames";
import { t } from "@lingui/macro";
import "@testing-library/jest-dom";

const mockData = [
  {
    id: 1,
    firstColumnValue: "First Column 01",
    secondColumnValue: "Second Column 01",
  },
  {
    id: 2,
    firstColumnValue: "First Column 02",
    secondColumnValue: "Second Column 02",
  },
];

const renderHeader = (col) => (
  <th
    scope="col"
    role="columnheader"
    className={classNames(
      `px-6 py-6 font-bold text-sm uppercase`,
      col.align === "right" ? "text-right" : "text-left"
    )}
  >
    {col.name}
  </th>
);

const renderFirstColumnData = (row) => {
  return (
    <td className="px-6 py-6" role="cell">
      {row.firstColumnValue}
    </td>
  );
};

const renderSecondColumnData = (row) => {
  return <td className="px-6 py-6">{row.secondColumnValue}</td>;
};

const mockColumns = [
  {
    name: "Field 1",
    renderHeader,
    renderData: renderFirstColumnData,
  },
  {
    name: "Field 2",
    renderHeader,
    renderData: renderSecondColumnData,
  },
];

test("render table with correct heading and body", async () => {
  render(
    <Table>
      <THead columns={mockColumns} />
      <TBody columns={mockColumns} data={mockData} />
    </Table>
  );

  const columnHeaders = screen.getAllByRole("columnheader");
  const tableBody = screen.getByTestId("app-table-body");
  const tableCells = screen.getAllByRole("cell");

  expect(tableBody.children).toHaveLength(mockData.length);
  expect(columnHeaders).toHaveLength(mockColumns.length);
  expect(columnHeaders[0]).toHaveTextContent(mockColumns[0].name);
  expect(columnHeaders[1]).toHaveTextContent(mockColumns[1].name);
  expect(tableCells[0]).toHaveTextContent(mockData[0].firstColumnValue);
  expect(tableCells[1]).toHaveTextContent(mockData[0].secondColumnValue);
  expect(tableCells[2]).toHaveTextContent(mockData[1].firstColumnValue);
  expect(tableCells[3]).toHaveTextContent(mockData[1].secondColumnValue);
});

test("render table loading message", async () => {
  render(
    <Table>
      <THead columns={mockColumns} />
      <TBody columns={mockColumns} data={[]} isLoading />
    </Table>
  );

  const loadingMessage = screen.getByText(t`Loading...`);
  screen.debug(loadingMessage);
});
