import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import {
  columns,
  MyLiquidityTxsTable,
} from "@/modules/my-liquidity/MyLiquidityTxsTable";

import * as LiquidityTxsHook from "@/src/hooks/useLiquidityTxs";
import * as PaginationHook from "@/src/hooks/usePagination";
import * as NetworkHook from "@/src/context/Network";
const Web3ReactHook = require("@web3-react/core");
import * as AppConstantsHook from "@/src/context/AppConstants";
import * as CoverOrProductDataHook from "@/src/hooks/useCoverOrProductData";

import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { fromNow } from "@/utils/formatter/relative-time";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

const mockData = {
  pagination: {
    page: 1,
    limit: 50,
    setPage: jest.fn(),
  },
  liquiditytxs: {
    data: {
      blockNumber: 12130964,
      transactions: [
        {
          type: "PodsIssued",
          key: "0x68696369662d62616e6b00000000000000000000000000000000000000000000",
          account: "0x7Bdae2a084ec653528b78e90b38d1a67c79f6caml",
          liquidityAmount: "500000000",
          podAmount: "500000000000000000000",
          vault: {
            id: "0x98e7786fff366aeff1a55131c92c4aa7edd68ad1",
            tokenSymbol: "HCF-nDAI",
            tokenDecimals: 18,
          },
          cover: {
            id: "0x68696369662d62616e6b00000000000000000000000000000000000000000000",
          },
          transaction: {
            id: "0x3639c211b26d20c598fe4bde46295912f3edcc3d6ca6ae03aac7eebeac450f31",
            timestamp: "1659078165",
          },
        },
        {
          type: "PodsIssued",
          key: "0x68696369662d62616e6b00000000000000000000000000000000000000000000",
          account: "0x7Bdae2a084ec653528b78e90b38d1a67c79f6caml",
          liquidityAmount: "500000000",
          podAmount: "500000000000000000000",
          vault: {
            id: "0x98e7786fff366aeff1a55131c92c4aa7edd68ad1",
            tokenSymbol: "HCF-nDAI",
            tokenDecimals: 18,
          },
          cover: {
            id: "0x68696369662d62616e6b00000000000000000000000000000000000000000000",
          },
          transaction: {
            id: "0x3639c211b26d20c598fe4bde46295912f3edcc3d6ca6ae03aac7eebeac450f31",
            timestamp: "1659078165",
          },
        },
      ],
      totalCount: 4,
    },
    loading: false,
    hasMore: true,
  },
  network: {
    networkId: 43113,
  },
  web3react: {
    account: "0x7BDAE2a084EC653528B78e90b38d1A67c79F6Caml",
  },
  appconstants: { liquidityTokenDecimals: 6 },
  coverInfo: {
    supportsProducts: false,
    infoObj: {
      coverName: "Hicif Bank OTC Cover",
      projectName: "Hicif Bank",
    },
  },
};

const initalMocks = () => {
  mockFunction(PaginationHook, "usePagination", () => mockData.pagination);
  mockFunction(
    LiquidityTxsHook,
    "useLiquidityTxs",
    () => mockData.liquiditytxs
  );
  mockFunction(NetworkHook, "useNetwork", () => mockData.network);
  mockFunction(Web3ReactHook, "useWeb3React", () => mockData.web3react);
  mockFunction(
    AppConstantsHook,
    "useAppConstants",
    () => mockData.appconstants
  );
  mockFunction(
    CoverOrProductDataHook,
    "useCoverOrProductData",
    () => mockData.coverInfo
  );
};

describe("MyLiquidityTxsTable test", () => {
  const initialRender = (newProps = {}, rerender = false) => {
    if (!rerender) initalMocks();
    act(() => {
      i18n.activate("en");
    });
    render(<MyLiquidityTxsTable {...newProps} />);
  };

  const rerender = (newProps = {}, mockParameters = []) => {
    if (mockParameters.length) {
      mockParameters.map((mock) => {
        mockFunction(mock.file, mock.method, mock.returnFn);
      });
    }

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
      expect(blockNumber).toBe(`#${mockData.liquiditytxs.data.blockNumber}`);
    });

    test("should render correct block url", () => {
      const card = screen.getByTestId("block-number");
      const blockNumber = card.querySelector("a").getAttribute("href");
      expect(blockNumber).toBe(
        getBlockLink(
          mockData.network.networkId,
          mockData.liquiditytxs.data.blockNumber
        )
      );
    });

    test("should not render blocknumber element if blocknumber data not present", () => {
      rerender({}, [
        {
          file: LiquidityTxsHook,
          method: "useLiquidityTxs",
          returnFn: () => ({
            ...mockData.liquiditytxs,
            data: {
              ...mockData.liquiditytxs.data,
              blockNumber: null,
            },
          }),
        },
      ]);
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
        mockData.liquiditytxs.data.transactions.length
      );
    });

    describe("Tx table data row", () => {
      test("should render correct transaction time in row", () => {
        const tableWrapper = screen.getByTestId("app-table-body");
        const row = tableWrapper.querySelectorAll("tr")[0];
        const renderedTime = row.querySelectorAll("td")[0].textContent;
        expect(renderedTime).toBe(
          fromNow(
            mockData.liquiditytxs.data.transactions[0].transaction.timestamp
          )
        );
      });

      test("should render correct tx details in row", () => {
        const tableWrapper = screen.getByTestId("app-table-body");
        const row = tableWrapper.querySelectorAll("tr")[0];
        const renderedDetails = row.querySelectorAll("td")[1].textContent;

        const dataRow = mockData.liquiditytxs.data.transactions[0];
        const expectedDetails = `${
          dataRow.type == "PodsIssued" ? "Added" : "Removed"
        } ${
          formatCurrency(
            convertFromUnits(
              dataRow.liquidityAmount,
              mockData.appconstants.liquidityTokenDecimals
            ),
            "en"
          ).short
        } ${dataRow.type == "PodsIssued" ? "to" : "from"} ${
          mockData.coverInfo.supportsProducts
            ? mockData.coverInfo.infoObj.coverName
            : mockData.coverInfo.infoObj.projectName
        }`;
        expect(renderedDetails).toBe(expectedDetails);
      });

      test("should render correct pod amount in row", () => {
        const tableWrapper = screen.getByTestId("app-table-body");
        const row = tableWrapper.querySelectorAll("tr")[0];
        const renderedAmount = row.querySelector(
          "td:nth-child(3)>div>span"
        ).textContent;

        const dataRow = mockData.liquiditytxs.data.transactions[0];
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

        const dataRow = mockData.liquiditytxs.data.transactions[0];
        expect(explorerLink).toBe(
          getTxLink(mockData.network.networkId, {
            hash: dataRow.transaction.id,
          })
        );
      });
    });

    test("should render no account message if no account connected", () => {
      rerender({}, [
        {
          file: Web3ReactHook,
          method: "useWeb3React",
          returnFn: () => ({
            account: null,
          }),
        },
      ]);
      const card = screen.getByTestId("no-account-message");
      const tableWrapper = screen.queryByTestId("app-table-body");

      expect(card).toBeInTheDocument();
      expect(tableWrapper).not.toBeInTheDocument();
    });
  });
});
