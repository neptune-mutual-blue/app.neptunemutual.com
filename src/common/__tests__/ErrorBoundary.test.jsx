import { act, render } from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import ErrorBoundary from "@/common/ErrorBoundary";

const ComponentWithError = () => {
  throw new Error("Error for testing");
  return <div>Error</div>;
};

describe("ErrorBoundary component", () => {
  beforeAll(() => {
    act(() => {
      i18n.activate("en");
      window.location.hash = "";
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("should render error if occured", () => {
    const screen = render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Error for testing/i)).toBeInTheDocument();
  });
});
