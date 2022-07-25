import React from "react";
import { render, screen, act } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { Card } from "@/common/CoverProfileInfo/CoverProfileInfo";

describe("ProjectStatusIndicator test", () => {
  let props = {
    coverKey:
      "0x616e696d617465642d6272616e64730000000000000000000000000000000000",
    productKey: "0",
    status: "Normal",
    incidentDate: "0",
  };

  beforeEach(() => {
    act(() => {
      i18n.activate("en");
    });
    render(<Card {...props} />);
  });

  test("should not render the badge if no status is provided", () => {
    render(<Card {...props} status="" />);
    const wrapper = screen.queryAllByTestId(
      "projectstatusindicator-container"
    )[1];
    expect(wrapper).toBeUndefined();
  });

  test("should render status badge correctly", () => {
    const wrapper = screen.getByTestId("projectstatusindicator-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should have correct classname based on status", async () => {
    let wrapper = screen.getByTestId("projectstatusindicator-container");
    expect(wrapper).toHaveClass("bg-21AD8C"); // when status is "Normal"

    render(<Card {...props} status="Stopped" />);
    wrapper = screen.getAllByTestId("projectstatusindicator-container")[1];
    expect(wrapper).toHaveClass("bg-9B9B9B"); // when status is "Stopped"

    render(<Card {...props} status="Claimable" />);
    wrapper = screen.getAllByTestId("projectstatusindicator-container")[2];
    expect(wrapper).toHaveClass("bg-4289F2"); // when status is "Claimable"

    render(<Card {...props} status="Incident Happened" />);
    wrapper = screen.getAllByTestId("projectstatusindicator-container")[3];
    expect(wrapper).toHaveClass("bg-FA5C2F"); // when status is "Incident Happened"
  });

  test("should display correct status", () => {
    const wrapper = screen
      .getByTestId("projectstatusindicator-container")
      .querySelector("div");
    expect(wrapper).toHaveTextContent(props.status);
  });

  test("should be link when incidentreport is valid", () => {
    render(<Card {...props} incidentDate="123124324" />);
    const wrapper = screen.getByTestId("badge-link");
    expect(wrapper).toBeInTheDocument();
  });

  test("should have correct badge link as provided in props", () => {
    const incidentDate = "123124324";
    const href = `/reporting/${safeParseBytes32String(
      props.coverKey
    )}/product/${props.productKey}/${incidentDate}/details`;
    render(<Card {...props} incidentDate={incidentDate} />);

    const wrapper = screen.getByTestId("badge-link");

    expect(wrapper).toHaveAttribute("href", href);
  });
});
