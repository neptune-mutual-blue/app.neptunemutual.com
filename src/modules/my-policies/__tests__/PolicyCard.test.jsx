import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { PolicyCard } from "@/modules/my-policies/PolicyCard";

import * as ValidReportHook from "@/src/hooks/useValidReport";
import * as ERC20BalanceHook from "@/src/hooks/useERC20Balance";
import * as FetchCoverStatsHook from "@/src/hooks/useFetchCoverStats";
import * as CoversHook from "@/src/context/Covers";
import { getCoverImgSrc } from "@/src/helpers/cover";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

const mockCoverInfo = {
  key: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
  coverName: "Bb8 Exchange Cover",
  projectName: "Bb8 Exchange",
};

const mockValidReport = {
  data: {
    report: {
      incidentDate: "1654263563",
      resolutionDeadline: "1654265793",
      status: "Claimable",
      claimBeginsFrom: "1654265794",
      claimExpiresAt: "1654267594",
    },
  },
};

const mocks = () => {
  mockFunction(CoversHook, "useCovers", () => ({
    getInfoByKey: jest.fn(() => mockCoverInfo),
  }));

  mockFunction(FetchCoverStatsHook, "useFetchCoverStats", () => ({
    status: "Normal",
  }));

  mockFunction(
    ValidReportHook,
    "useValidReport",
    jest.fn(() => mockValidReport)
  );

  mockFunction(ERC20BalanceHook, "useERC20Balance", () => ({
    balance: "1400000000000000000000",
  }));
};

describe("PoliciesTab test", () => {
  const props = {
    policyInfo: {
      cover: {
        id: "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
      },
      cxToken: {
        id: "0x1e26d3104132c01ffb4bd219c2865a6436dc6ee1",
        creationDate: "1654065199",
        expiryDate: "1656633599",
      },
    },
  };

  const initialRender = (newProps = {}, runMocks = true) => {
    if (runMocks) mocks();
    act(() => {
      i18n.activate("en");
    });
    render(<PolicyCard {...props} {...newProps} />);
  };

  const rerender = (newProps = {}, mockParameters = []) => {
    if (mockParameters.length) {
      mockParameters.map((mock) => {
        mockFunction(mock.file, mock.method, mock.returnFn);
      });
    }

    cleanup();
    initialRender(newProps, false);
  };

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  test("should render the main container", () => {
    const hero = screen.getByTestId("policy-card");
    expect(hero).toBeInTheDocument();
  });

  test("should not render the main container if coveInfo is not available", () => {
    rerender({}, [
      {
        file: CoversHook,
        method: "useCovers",
        returnFn: () => ({
          getInfoByKey: jest.fn(() => null),
        }),
      },
    ]);

    const hero = screen.queryByTestId("policy-card");
    expect(hero).not.toBeInTheDocument();
  });

  describe("Cover Image", () => {
    test("should render the cover image", () => {
      const coverImage = screen.getByTestId("cover-img");
      expect(coverImage).toBeInTheDocument();
    });

    test("cover image should have correct src", () => {
      const coverImage = screen.getByTestId("cover-img");
      const src = getCoverImgSrc({ key: props.policyInfo.cover.id });
      expect(coverImage).toHaveAttribute("src", src);
    });

    test("cover image should have correct alt text", () => {
      const coverImage = screen.getByTestId("cover-img");
      const text = mockCoverInfo.projectName;
      expect(coverImage).toHaveAttribute("alt", text);
    });
  });

  describe("Status badge", () => {
    test("should not display anything if status is 'Normal'", () => {
      const status = screen.getByTestId("policy-card-status");
      expect(status).toHaveTextContent("");
    });

    test("should display status badge if status is not 'Normal'", () => {
      rerender({}, [
        {
          file: FetchCoverStatsHook,
          method: "useFetchCoverStats",
          returnFn: () => ({
            status: "Claimable",
          }),
        },
        {
          file: ValidReportHook,
          method: "useValidReport",
          returnFn: () => ({
            data: {
              report: {
                ...mockValidReport.data.report,
                status: "Expired",
              },
            },
          }),
        },
      ]);
      const status = screen.getByTestId("policy-card-status");
      expect(status).toHaveTextContent("Claimable");
    });
  });

  test("should dsplay correct policy card title", () => {
    const title = screen.getByTestId("policy-card-title");
    expect(title).toHaveTextContent(mockCoverInfo.projectName);
  });

  test("should render policy card footer", () => {
    const footer = screen.getByTestId("policy-card-footer");
    expect(footer).toBeInTheDocument();
  });
});
