import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import {
  columns,
  MyLiquidityTxsTable,
} from "@/modules/my-liquidity/MyLiquidityTxsTable";

import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { fromNow } from "@/utils/formatter/relative-time";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

const initalMocks = () => {
  mockFn.usePagination();
  mockFn.useLiquidityTxs();
  mockFn.useNetwork();
  mockFn.useWeb3React();
  mockFn.useAppConstants();
  mockFn.useCoverOrProductData();
};

describe("MyLiquidityTxsTable test", () => {
  const initialRender = (newProps = {}, rerender = false) => {
    if (!rerender) initalMocks();
    act(() => {
      i18n.activate("en");
    });
    render(<MyLiquidityTxsTable {...newProps} />);
  };

  const rerender = (newProps = {}, mocks = () => {}) => {
    mocks();

    cleanup();
    initialRender(newProps, true);
  };

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  describe("Blocknumber", () => {
    test("should render blocknumber element if blocknumber data present", () => {
      const card = screen.getByTestId("block-number");
      expect(card).toBeInTheDocument();
    });

    test("correct blocknumber data should be displayed", () => {
      const card = screen.getByTestId("block-number");
      const blockNumber = card.querySelector("a").textContent;
      expect(blockNumber).toBe(`#${testData.liquidityTxs.data.blockNumber}`);
    });

    test("should render correct block url", () => {
      const card = screen.getByTestId("block-number");
      const blockNumber = card.querySelector("a").getAttribute("href");
      expect(blockNumber).toBe(
        getBlockLink(
          testData.network.networkId,
          testData.liquidityTxs.data.blockNumber
        )
      );
    });

    test("should not render blocknumber element if blocknumber data not present", () => {
      rerender({}, () => {
        mockFn.useLiquidityTxs(() => ({
          ...testData.liquidityTxs,
          data: {
            ...testData.liquidityTxs.data,
            blockNumber: null,
          },
        }));
      });
      const card = screen.queryByTestId("block-number");
      expect(card).not.toBeInTheDocument();
    });
  });

  describe("Table", () => {
    test("should render table head", () => {
      const card = screen.getByTestId("table-head");
      expect(card).toBeInTheDocument();
    });

    test("should render correct number of columns", () => {
      const card = screen.getByTestId("table-head");
      const renderedColumns = card.querySelectorAll("th");
      expect(renderedColumns.length).toBe(columns.length);
    });

    test("should render the TBody component if account connected", () => {
      const tableWrapper = screen.getByTestId("app-table-body");
      expect(tableWrapper).toBeInTheDocument();
    });

    test("should render correct number of table rows", () => {
      const tableWrapper = screen.getByTestId("app-table-body");
      const tableRows = tableWrapper.querySelectorAll("tr");
      expect(tableRows.length).toBe(
        testData.liquidityTxs.data.transactions.length
      );
    });

    describe("Tx table data row", () => {
      test("should render correct transaction time in row", () => {
        const tableWrapper = screen.getByTestId("app-table-body");
        const row = tableWrapper.querySelectorAll("tr")[0];
        const renderedTime = row.querySelectorAll("td")[0].textContent;
        expect(renderedTime).toBe(
          fromNow(
            testData.liquidityTxs.data.transactions[0].transaction.timestamp
          )
        );
      });

      test("should render correct tx details in row", () => {
        const tableWrapper = screen.getByTestId("app-table-body");
        const row = tableWrapper.querySelectorAll("tr")[0];
        const renderedDetails = row.querySelectorAll("td")[1].textContent;

        const dataRow = testData.liquidityTxs.data.transactions[0];
        const expectedDetails = `${
          dataRow.type == "PodsIssued" ? "Added" : "Removed"
        } ${
          formatCurrency(
            convertFromUnits(
              dataRow.liquidityAmount,
              testData.appConstants.liquidityTokenDecimals
            ),
            "en"
          ).short
        } ${dataRow.type == "PodsIssued" ? "to" : "from"} ${
          testData.coverInfo.supportsProducts
            ? testData.coverInfo.infoObj.coverName
            : testData.coverInfo.infoObj.projectName
        }`;
        expect(renderedDetails).toBe(expectedDetails);
      });

      test("should render correct pod amount in row", () => {
        const tableWrapper = screen.getByTestId("app-table-body");
        const row = tableWrapper.querySelectorAll("tr")[0];
        const renderedAmount = row.querySelector(
          "td:nth-child(3)>div>span"
        ).textContent;

        const dataRow = testData.liquidityTxs.data.transactions[0];
        const expectedAmount = formatCurrency(
          convertFromUnits(dataRow.podAmount, dataRow.vault.tokenDecimals),
          "en",
          dataRow.vault.tokenSymbol,
          true
        ).short;
        expect(renderedAmount).toBe(expectedAmount);

        const metamaskButtonTitle = row
          .querySelector("td:nth-child(3)>div>button")
          .getAttribute("title");
        expect(metamaskButtonTitle).toBe("Add to Metamask");
      });

      test("should have correct 'Open in Explorer' link in row", () => {
        const tableWrapper = screen.getByTestId("app-table-body");
        const row = tableWrapper.querySelectorAll("tr")[0];
        const explorerLink = row
          .querySelector("td:nth-child(4)>div>a")
          .getAttribute("href");

        const dataRow = testData.liquidityTxs.data.transactions[0];
        expect(explorerLink).toBe(
          getTxLink(testData.network.networkId, {
            hash: dataRow.transaction.id,
          })
        );
      });
    });

    test("should render no account message if no account connected", () => {
      rerender({}, () => {
        mockFn.useWeb3React(() => ({
          account: null,
        }));
      });
      const card = screen.getByTestId("no-account-message");
      const tableWrapper = screen.queryByTestId("app-table-body");

      expect(card).toBeInTheDocument();
      expect(tableWrapper).not.toBeInTheDocument();
    });
  });
});
