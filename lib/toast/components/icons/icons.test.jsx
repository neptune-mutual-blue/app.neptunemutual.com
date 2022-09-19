import CloseIcon from "./CloseIcon";
import ErrorIcon from "./ErrorIcon";
import InfoIcon from "./InfoIcon";
import LoadingIcon from "./LoadingIcon";
import MinimizeIcon from "./MinimizeIcon";
import SuccessIcon from "./SuccessIcon";
import WarningIcon from "./WarningIcon";
import { render } from "@testing-library/react";

describe("Toast Icons", () => {
  test("CloseIcon", () => {
    const { getByTestId } = render(<CloseIcon data-testid="CloseIcon" />);

    const logo = getByTestId("CloseIcon");

    expect(logo).toBeInTheDocument();
  });

  test("ErrorIcon", () => {
    const { getByTestId } = render(<ErrorIcon data-testid="ErrorIcon" />);

    const logo = getByTestId("ErrorIcon");

    expect(logo).toBeInTheDocument();
  });

  test("InfoIcon", () => {
    const { getByTestId } = render(<InfoIcon data-testid="InfoIcon" />);

    const logo = getByTestId("InfoIcon");

    expect(logo).toBeInTheDocument();
  });

  test("LoadingIcon", () => {
    const { getByTestId } = render(<LoadingIcon data-testid="LoadingIcon" />);

    const logo = getByTestId("LoadingIcon");

    expect(logo).toBeInTheDocument();
  });

  test("MinimizeIcon", () => {
    const { getByTestId } = render(<MinimizeIcon data-testid="MinimizeIcon" />);

    const logo = getByTestId("MinimizeIcon");

    expect(logo).toBeInTheDocument();
  });

  test("SuccessIcon", () => {
    const { getByTestId } = render(<SuccessIcon data-testid="SuccessIcon" />);

    const logo = getByTestId("SuccessIcon");

    expect(logo).toBeInTheDocument();
  });

  test("WarningIcon", () => {
    const { getByTestId } = render(<WarningIcon data-testid="WarningIcon" />);

    const logo = getByTestId("WarningIcon");

    expect(logo).toBeInTheDocument();
  });
});
