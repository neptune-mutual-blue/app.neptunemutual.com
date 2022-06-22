import React from "react";
import { render, act, cleanup, screen } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import { Stat } from "@/modules/my-policies/PolicyCardFooter";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

describe("PoliciesTab test", () => {
  const props = {
    title: "Expires In",
    tooltip: "Jul 1, 2022, 5:44:59 AM GMT+5:45",
    value: "in 3 weeks",
    right: false,
    variant: undefined,
  };

  const initialRender = (newProps = {}) => {
    act(() => {
      i18n.activate("en");
    });
    render(<Stat {...props} {...newProps} />);
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

  test("should render the main container", () => {
    const stat = screen.getByTestId("footer-stat");
    expect(stat).toBeInTheDocument();
  });

  test("should render correct stat title", () => {
    const container = screen.getByTestId("footer-stat");
    const title = container.querySelector("h5");
    expect(title.textContent).toBe(props.title);
  });

  test("should render correct stat value", () => {
    const container = screen.getByTestId("footer-stat");
    const value = container.querySelector("p");
    expect(value.textContent).toBe(props.value);
  });

  test("should have class `text-FA5C2F` if variant is 'error'", () => {
    rerender({ ...props, variant: "error" });
    const container = screen.getByTestId("footer-stat");
    const value = container.querySelector("p");
    expect(value).toHaveClass("text-FA5C2F");
  });

  test("should have class `text-7398C0` if variant is not 'error'", () => {
    rerender({ ...props, variant: "normal" });
    const container = screen.getByTestId("footer-stat");
    const value = container.querySelector("p");
    expect(value).toHaveClass("text-7398C0");
  });

  test("should have correct `title` attribute", () => {
    const container = screen.getByTestId("footer-stat");
    const value = container.querySelector("p");
    expect(value.getAttribute("title")).toBe(props.tooltip);
  });
});
