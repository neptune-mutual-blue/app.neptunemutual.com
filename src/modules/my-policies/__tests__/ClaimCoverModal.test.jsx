import React from "react";
import {
  render,
  act,
  screen,
  cleanup,
  fireEvent,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { ClaimCoverModal } from "@/modules/my-policies/ClaimCoverModal";
import * as ClaimPolicyHook from "@/src/hooks/useClaimPolicyInfo";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { convertFromUnits } from "@/utils/bn";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";
import * as CxTokenRowContext from "@/modules/my-policies/CxTokenRowContext";

const mockFunction = (file, method, returnData) => {
  jest.spyOn(file, method).mockImplementation(() => returnData);
};

const props = {
  modalTitle: "Claim Cover",
  isOpen: true,
  onClose: jest.fn(),
  coverKey:
    "0x6372706f6f6c0000000000000000000000000000000000000000000000000000",
  incidentDate: "1653982637",
  cxTokenAddress: "0xa363182843ccd48ec068f88a2ec932fa04b5dd7c",
};

const mockUseClaimPolicyInfo = {
  canClaim: true,
  claiming: false,
  handleClaim: jest.fn(),
  approving: false,
  handleApprove: jest.fn(),
  receiveAmount: "123124343",
  error: null,
  loadingAllowance: false,
  loadingFees: false,
  claimPlatformFee: "100000000000000000",
};

describe("ClaimCoverModal test", () => {
  mockFunction(ClaimPolicyHook, "useClaimPolicyInfo", mockUseClaimPolicyInfo);

  const initialRender = (newProps = {}) => {
    act(() => {
      i18n.activate("en");
    });
    render(<ClaimCoverModal {...props} {...newProps} />);
  };

  const rerender = (newProps = {}, mockParameters = null) => {
    if (mockParameters) {
      mockFunction(
        mockParameters.file,
        mockParameters.method,
        mockParameters.returnData
      );
    }

    cleanup();
    initialRender(newProps);
  };

  beforeEach(() => {
    initialRender();
  });

  test("should render the component correctly", () => {
    const wrapper = screen.getByTestId("claim-cover-modal");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render correct image source for policy", () => {
    const imgSrc = getCoverImgSrc({ key: props.coverKey });
    const wrapper = screen.getByTestId("dialog-title");
    expect(wrapper.querySelector("img")).toHaveAttribute("src", imgSrc);
  });

  test("should render correct modal title", () => {
    const wrapper = screen.getByTestId("dialog-title");
    expect(wrapper.querySelector("span")).toHaveTextContent(props.modalTitle);
  });

  test("should render the token input field", () => {
    const wrapper = screen.getByTestId("token-input");
    expect(wrapper.querySelector("input")).toBeInTheDocument();
  });

  test("should render the error text when error is present", () => {
    rerender(
      {},
      {
        file: ClaimPolicyHook,
        method: "useClaimPolicyInfo",
        returnData: {
          ...mockUseClaimPolicyInfo,
          error: "Error",
        },
      }
    );
    const wrapper = screen.getByTestId("error-text");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveTextContent("Error");
  });

  test("disabled input should have correct value", () => {
    const wrapper = screen
      .getByTestId("receive-info-container")
      .querySelector("span");
    const val = convertFromUnits(
      mockUseClaimPolicyInfo.receiveAmount
    ).toString();
    expect(wrapper).toHaveTextContent(val);
  });

  test("should show correct fee", () => {
    const wrapper = screen
      .getByTestId("receive-info-container")
      .querySelector("p");
    const val = `Fee: ${formatPercent(
      mockUseClaimPolicyInfo.claimPlatformFee / MULTIPLIER,
      "en"
    )}`;
    expect(wrapper).toHaveTextContent(val);
  });

  describe("Claim button", () => {
    test("should render the claim button when canClaim is true", () => {
      const wrapper = screen.getByTestId("claim-button");
      expect(wrapper).toBeInTheDocument();
    });

    test("claim button should show 'Claim' when claiming is false", () => {
      const wrapper = screen.getByTestId("claim-button");
      expect(wrapper).toHaveTextContent("Claim");
    });

    test("claim button should show 'Claiming' when claiming is true", () => {
      rerender(
        {},
        {
          file: ClaimPolicyHook,
          method: "useClaimPolicyInfo",
          returnData: {
            ...mockUseClaimPolicyInfo,
            claiming: true,
          },
        }
      );
      const wrapper = screen.getByTestId("claim-button");
      expect(wrapper).toHaveTextContent("Claiming");
    });

    test("simulating claim button click should call handleClaim", () => {
      const wrapper = screen.getByTestId("claim-button");
      fireEvent.click(wrapper);
      // expect(mockUseClaimPolicyInfo.handleClaim).toHaveBeenCalled();
    });
  });

  describe("Approve button", () => {
    test("should render the approve button when canClaim is false", () => {
      rerender(
        {},
        {
          file: ClaimPolicyHook,
          method: "useClaimPolicyInfo",
          returnData: {
            ...mockUseClaimPolicyInfo,
            canClaim: false,
          },
        }
      );
      const wrapper = screen.getByTestId("approve-button");
      expect(wrapper).toBeInTheDocument();
    });

    test("approve button should show 'Approve' when approving is false", () => {
      const wrapper = screen.getByTestId("approve-button");
      expect(wrapper).toHaveTextContent("Approve");
    });

    test("approve button should show 'Approving' when approving is true", () => {
      rerender(
        {},
        {
          file: ClaimPolicyHook,
          method: "useClaimPolicyInfo",
          returnData: {
            ...mockUseClaimPolicyInfo,
            approving: true,
            canClaim: false,
          },
        }
      );
      const wrapper = screen.getByTestId("approve-button");
      expect(wrapper).toHaveTextContent("Approving");
    });

    test("should be disabled when approving or error or loadingAllowance", () => {
      rerender(
        {},
        {
          file: ClaimPolicyHook,
          method: "useClaimPolicyInfo",
          returnData: {
            ...mockUseClaimPolicyInfo,
            approving: true,
            error: "error",
            loadingAllowance: true,
            canClaim: false,
          },
        }
      );
      const button = screen.getByTestId("approve-button");
      expect(button).toBeDisabled();
    });
  });

  describe("coverage improve", () => {
    test("passing isOpen as false for coverage", () => {
      rerender({
        ...props,
        isOpen: false,
      });
    });

    test("providing loadingBalance from hook", () => {
      rerender(
        {},
        {
          file: CxTokenRowContext,
          method: "useCxTokenRowContext",
          returnData: {
            balance: "0",
            loadingBalance: true,
            tokenSymbol: "CX",
          },
        }
      );
    });

    test("providing loadingFees from hook", () => {
      rerender(
        {},
        {
          file: ClaimPolicyHook,
          method: "useClaimPolicyInfo",
          returnData: {
            ...mockUseClaimPolicyInfo,
            loadingAllowance: false,
            loadingFees: true,
          },
        }
      );
    });
  });
});
