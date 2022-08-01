import React from "react";
import {
  render,
  act,
  screen,
  cleanup,
  fireEvent,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import * as Component from "@/modules/my-policies/MyPoliciesTxsTable";
import * as PolicyTxs from "@/src/hooks/usePolicyTxs";
import * as Network from "@/src/context/Network";
const Web3React = require("@web3-react/core");
import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import DateLib from "@/lib/date/DateLib";
import * as UseCoverHook from "@/src/hooks/useCovers";
import { fromNow } from "@/utils/formatter/relative-time";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";
import * as UseRegisterTokenHook from "@/src/hooks/useRegisterToken";

const mockPolicyTxData = {
  data: {
    blockNumber: 26582383,
    transactions: [
      {
        type: "CoverPurchased",
        key: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
        account: "0x9bdae2a084ec18528b78e90b38d1a67c79f6cab6",
        cxTokenAmount: "1000000000000000000000",
        daiAmount: "1000000000000000000000",
        cxToken: {
          id: "0x4a1801c51b1acb083cc198fc3022d08eac0b583d",
          tokenSymbol: "cxUSD",
          tokenName: "bb8-exchange-cxtoken",
        },
        cover: {
          id: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
        },
        transaction: {
          id: "0x90d468cb0bdd9bd02e5167a7017688072c56e58f5e68de649aec13f3c3d92654",
          timestamp: "1654238241",
        },
      },
      {
        type: "Claimed",
        key: "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
        account: "0x9bdae2a084ec18528b78e90b38d1a67c79f6cab6",
        cxTokenAmount: "100000000000000000000",
        daiAmount: "100000000000000000000",
        cxToken: {
          id: "0x1e26d3104132c01ffb4bd219c2865a6436dc6ee1",
          tokenSymbol: "cxUSD",
          tokenName: "animated-brands-cxtoken",
        },
        cover: {
          id: "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
        },
        transaction: {
          id: "0x67cf26b73121410b9019fba892a2a70a5ab48bc8defc562b1044377c48bcd46b",
          timestamp: "1654167774",
        },
      },
      {
        type: "CoverPurchased",
        key: "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
        account: "0x9bdae2a084ec18528b78e90b38d1a67c79f6cab6",
        cxTokenAmount: "100000000000000000000",
        daiAmount: "100000000000000000000",
        cxToken: {
          id: "0x1e26d3104132c01ffb4bd219c2865a6436dc6ee1",
          tokenSymbol: "cxUSD",
          tokenName: "animated-brands-cxtoken",
        },
        cover: {
          id: "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
        },
        transaction: {
          id: "0xc9bb4fe739341103c8939ef61dc853b9ff04aa59ae7bec468b21c3648d8d19ce",
          timestamp: "1654167673",
        },
      },
    ],
    totalCount: 3,
  },
  loading: false,
  hasMore: false,
};

const mockNetworkId = { networkId: 80001 };

const mockAccount = { account: "0x9BDAE2a084EC18528B78e90b38d1A67c79F6Cab6" };

const mockCoverData = {
  getInfoByKey: () => ({
    projectName: "animated-brands",
  }),
};

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

describe("MyPoliciesTxsTable test", () => {
  mockFunction(PolicyTxs, "usePolicyTxs", () => mockPolicyTxData);
  mockFunction(Network, "useNetwork", () => mockNetworkId);
  mockFunction(Web3React, "useWeb3React", () => mockAccount);

  const initialRender = (newProps = {}) => {
    act(() => {
      i18n.activate("en");
    });
    render(<Component.MyPoliciesTxsTable {...newProps} />);
  };

  const rerender = (newProps = {}, mockParameters = null) => {
    if (mockParameters) {
      mockFunction(
        mockParameters.file,
        mockParameters.method,
        mockParameters.returnFn
      );
    }

    cleanup();
    initialRender(newProps);
  };

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  describe.only("Block number", () => {
    test.only("should render block number element if blockNumber is available", () => {
      const blockP = screen.getByTestId("block-number");
      expect(blockP).toBeInTheDocument();
    });

    test("should render correct block number text", () => {
      const block_a = screen.getByTestId("block-number").querySelector("a");
      expect(block_a).toHaveTextContent(
        "#" + mockPolicyTxData.data.blockNumber
      );
    });

    test("should render correct block href link", () => {
      const block_a = screen.getByTestId("block-number").querySelector("a");
      const href = getBlockLink(
        mockNetworkId.networkId,
        mockPolicyTxData.data.blockNumber
      );
      expect(block_a).toHaveAttribute("href", href);
    });

    test("should not render block number element if blockNumber is not available", () => {
      rerender(
        {},
        {
          file: PolicyTxs,
          method: "usePolicyTxs",
          returnFn: () => ({
            ...mockPolicyTxData,
            data: {
              ...mockPolicyTxData.data,
              blockNumber: null,
            },
          }),
        }
      );
      const blockP = screen.queryByTestId("block-number");
      expect(blockP).not.toBeInTheDocument();
    });
  });

  test("should render table wrapper", () => {
    const tableWrapper = screen.getByTestId("policy-txs-table-wrapper");
    expect(tableWrapper).toBeInTheDocument();
  });

  describe("Table Head", () => {
    test("should render correct number of th elements", () => {
      const ths = screen
        .getByTestId("policy-txs-table-header")
        .querySelectorAll("th");
      expect(ths.length).toBe(Component.columns.length);
    });

    test("should render correct table header text", () => {
      const ths = screen
        .getByTestId("policy-txs-table-header")
        .querySelectorAll("th");
      expect(ths[0].textContent).toBe(Component.columns[0].name);
      expect(ths[1].textContent).toBe(Component.columns[1].name);
      expect(ths[2].textContent).toBe(Component.columns[2].name);
    });
  });

  test("should render the connect wallet td if account is not available", () => {
    rerender(
      {},
      {
        file: Web3React,
        method: "useWeb3React",
        returnFn: () => ({
          account: null,
        }),
      }
    );
    const tbody = screen.getByTestId("connect-wallet-tbody");
    expect(tbody).toBeInTheDocument();
    expect(tbody.querySelector("tr>td")).toHaveTextContent(
      "Please connect your wallet..."
    );
  });

  describe("Table Row Data", () => {
    describe("Col 1: 'WHEN'", () => {
      test("should render correct transaction time in table row", () => {
        rerender(
          {},
          {
            file: Web3React,
            method: "useWeb3React",
            returnFn: () => mockAccount,
          }
        );
        const td = screen.getAllByTestId("timestamp-col")[0];
        expect(td.textContent).toBe(
          fromNow(mockPolicyTxData.data.transactions[0].transaction.timestamp)
        );
      });

      test("should render correct transaction time in td title", () => {
        const td = screen.getAllByTestId("timestamp-col")[0];
        expect(td.title).toBe(
          DateLib.toLongDateFormat(
            mockPolicyTxData.data.transactions[0].transaction.timestamp,
            "en"
          )
        );
      });
    });

    describe("Col 2: 'DETAILS'", () => {
      test("should not render details item if no coverInfo", () => {
        rerender(
          {},
          {
            file: UseCoverHook,
            method: "useCovers",
            returnFn: () => ({
              data: mockCoverData,
              loading: false,
            }),
          }
        );
        const tbody = screen.queryByTestId("app-table-body");
        const tds = tbody.querySelectorAll("tr")[0].querySelectorAll("td");
        expect(tds.length).toBe(Component.columns.length - 1);
      });

      test("should render correct details in the row", () => {
        rerender(
          {},
          {
            file: UseCoverHook,
            method: "useCovers",
            returnFn: () => mockCoverData,
          }
        );

        const td = screen.getAllByTestId("details-col")[0];
        expect(td).toBeInTheDocument();
      });

      test("should render correct image in details row", () => {
        const td = screen.getAllByTestId("details-col")[0];
        const img = td.querySelector("img");
        const src = getCoverImgSrc({
          key: mockPolicyTxData.data.transactions[0].cover.id,
        });
        expect(img).toHaveAttribute("src", src);
      });

      test("should have `Purchased` in details if type if 'Purchased'", () => {
        const td = screen.getAllByTestId("details-col")[0];
        const span = td.querySelector("span");
        expect(span).toHaveTextContent("Purchased");
      });

      test("should have `Claimed` in details if type if not 'Purchased'", () => {
        const td = screen.getAllByTestId("details-col")[1];
        const span = td.querySelector("span");
        expect(span).toHaveTextContent("Claimed");
      });

      test("should have correct currency details", () => {
        const span = screen
          .getAllByTestId("details-col")[0]
          .querySelector("span");
        const text = formatCurrency(
          convertFromUnits(mockPolicyTxData.data.transactions[0].daiAmount),
          "en"
        ).short;
        expect(span).toHaveTextContent(text);
      });

      test("should have correct currency details in `title` attribute", () => {
        const span = screen
          .getAllByTestId("details-col")[0]
          .querySelector("span>span");
        const text = formatCurrency(
          convertFromUnits(mockPolicyTxData.data.transactions[0].daiAmount),
          "en"
        ).long;
        expect(span).toHaveAttribute("title", text);
      });

      test("should show correct project name in details", () => {
        const span = screen
          .getAllByTestId("details-col")[0]
          .querySelector("span");
        const text = mockCoverData.getInfoByKey().projectName;
        expect(span).toHaveTextContent(text);
      });
    });

    describe("Col 3: 'AMOUNT'", () => {
      const mockFn = jest.fn();
      rerender(
        {},
        {
          file: UseRegisterTokenHook,
          method: "useRegisterToken",
          returnFn: () => ({
            register: mockFn,
          }),
        }
      );

      test("span element should have class based on transaction type", () => {
        const spanPurchased = screen
          .getAllByTestId("col-amount")[0]
          .querySelector("span");
        expect(spanPurchased).toHaveClass("text-404040");

        const spanClaimed = screen
          .getAllByTestId("col-amount")[1]
          .querySelector("span");
        expect(spanClaimed).toHaveClass("text-FA5C2F");
      });

      test("span element correct amount text content", () => {
        const span = screen
          .getAllByTestId("col-amount")[0]
          .querySelector("span");

        const text = formatCurrency(
          convertFromUnits(mockPolicyTxData.data.transactions[0].cxTokenAmount),
          "en",
          mockPolicyTxData.data.transactions[0].cxTokenData.tokenSymbol,
          true
        ).short;
        expect(span).toHaveTextContent(text);
      });

      test("span element correct amount title content", () => {
        const span = screen
          .getAllByTestId("col-amount")[0]
          .querySelector("span");

        const text = formatCurrency(
          convertFromUnits(mockPolicyTxData.data.transactions[0].cxTokenAmount),
          "en",
          mockPolicyTxData.data.transactions[0].cxTokenData.tokenSymbol,
          true
        ).long;
        expect(span.title).toBe(text);
      });

      test("should have add button", () => {
        const btn = screen
          .getAllByTestId("col-amount")[0]
          .querySelector("button");
        expect(btn).toBeInTheDocument();
      });

      test("simulate click on add button", () => {
        const btn = screen
          .getAllByTestId("col-amount")[0]
          .querySelector("button");
        fireEvent.click(btn);
        expect(mockFn).toHaveBeenCalled();
      });
    });

    describe("Col 4: 'Actions'", () => {
      test("should render the timestamp button", () => {
        const btn = screen
          .getAllByTestId("col-actions")[0]
          .querySelector("button");
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent("Timestamp");
      });

      test("should render the 'Open in explorer' link", () => {
        const link = screen.getAllByTestId("col-actions")[0].querySelector("a");
        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent("Open in explorer");
      });

      test("link should have correct href", () => {
        const link = screen.getAllByTestId("col-actions")[0].querySelector("a");
        const href = getTxLink(mockNetworkId.networkId, {
          hash: mockPolicyTxData.data.transactions[0].transaction.id,
        });
        expect(link).toHaveAttribute("href", href);
      });
    });
  });
});
