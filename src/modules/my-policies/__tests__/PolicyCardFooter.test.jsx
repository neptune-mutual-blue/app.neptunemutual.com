import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import { PolicyCardFooter } from "@/modules/my-policies/PolicyCardFooter";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

describe("PolicyCardFooter test", () => {
  const props = {
    coverKey:
      "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
    productKey:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    isDiversified: false,
    cxToken: {
      id: "0x0fdc3e2afd39a4370f5d493d5d2576b8ab3c5258",
      creationDate: "1658995606",
      expiryDate: "1667260799",
    },
    report: {
      incidentDate: "1658995751",
      resolutionDeadline: "1659004881",
      status: "Claimable",
      claimBeginsFrom: "1659004882",
      claimExpiresAt: "1659006682",
    },
    tokenBalance: "1000000000000000000000",
    validityEndsAt: "1667260799",
  };

  const initialRender = (newProps = {}) => {
    act(() => {
      i18n.activate("en");
    });
    render(<PolicyCardFooter {...props} {...newProps} />);
  };

  const rerender = (newProps = {}, mockParameters = []) => {
    if (mockParameters.length) {
      mockParameters.map((mock) => {
        mockFunction(mock.file, mock.method, mock.returnFn);
      });
    }

    cleanup();
    initialRender(newProps);
  };

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  test("should render policy card footer", () => {
    const footer = screen.getByTestId("policy-card-footer");
    expect(footer).toBeInTheDocument();
  });

  test("should render the purchase policy stats", () => {
    const footer = screen.getByText("Purchased Policy");
    expect(footer).toBeInTheDocument();
  });

  test("should not render the claim link if not within claim period", () => {
    const footer = screen.queryByTestId("claim-link");
    expect(footer).not.toBeInTheDocument();
  });

  test("should render the claim link if within claim period", () => {
    rerender({
      report: {
        ...props.report,
        status: "Claimable",
        claimBeginsFrom: "1654265794",
        claimExpiresAt: new Date().getTime() / 1000 + 10000,
      },
    });

    const link = screen.queryByTestId("claim-link");
    expect(link).toBeInTheDocument();
  });

  test("should render correct claim link", () => {
    rerender({
      report: {
        ...props.report,
        claimExpiresAt: new Date().getTime() / 1000 + 10000,
      },
    });

    const linkComponent = screen.getByTestId("claim-link");
    const link = `/my-policies/${safeParseBytes32String(props.coverKey)}/${
      props.report.incidentDate
    }/claim`;
    expect(linkComponent).toHaveAttribute("href", link);
  });

  test("should have `CLAIM` text in claim link", () => {
    rerender({
      report: {
        ...props.report,
        claimExpiresAt: new Date().getTime() / 1000 + 10000,
      },
    });

    const link = screen.getByTestId("claim-link");
    expect(link).toHaveTextContent("CLAIM");
  });
});
