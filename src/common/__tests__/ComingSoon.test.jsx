import { ComingSoon } from "@/common/ComingSoon";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

describe("Banner test", () => {
  const { initialRender } = initiateTest(ComingSoon);

  beforeEach(() => {
    initialRender();
  });

  test("should render the main container", () => {
    const wrapper = screen.queryByTestId("main-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the `Coming soon!` text", () => {
    const text = screen.queryByText("Coming soon!");
    expect(text).toBeInTheDocument();
  });

  test("should render the back-to-homepage text with correct link", () => {
    const text = screen.queryByText("Take me back to homepage");
    expect(text).toBeInTheDocument();
    expect(text).toHaveAttribute("href", "/");
  });
});
