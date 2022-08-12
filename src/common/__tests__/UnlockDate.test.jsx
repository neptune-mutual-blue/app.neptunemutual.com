import { UnlockDate } from "@/common/UnlockDate";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

const props = {
  title: "2 days ago",
  value: "17/05/2020",
};
describe("UnlockDate", () => {
  const { initialRender } = initiateTest(UnlockDate, props);

  beforeEach(() => {
    initialRender();
  });

  test("should render `Unlock Date` label", () => {
    const label = screen.getByText("Unlock Date");
    expect(label).toBeInTheDocument();
  });

  test("should render correct value", () => {
    const span = screen.getByTestId("detail-span");
    expect(span).toHaveTextContent(props.value);
  });

  test("should render correct title text", () => {
    const span = screen.getByTestId("detail-span");
    expect(span).toHaveAttribute("title", props.title);
  });
});
