import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { ActiveReportingEmptyState } from "@/modules/reporting/active/ActiveReportingEmptyState";
import { fireEvent, screen } from "@testing-library/react";

describe("ActiveReportingEmptyState loading state", () => {
  beforeEach(() => {
    mockFn.useRouter();
    mockFn.useFlattenedCoverProducts({ loading: true });

    const { initialRender } = initiateTest(ActiveReportingEmptyState, {});

    initialRender();
  });

  test("should render loading when hook returns loading", () => {
    const loadingText = screen.getByText(/loading.../);
    expect(loadingText).toBeInTheDocument();
  });
});

describe("ActiveReportingEmptyState loading state", () => {
  // const handleAddReport = jest.fn(() => {});

  beforeEach(() => {
    mockFn.useRouter();
    mockFn.useFlattenedCoverProducts();

    const { initialRender } = initiateTest(ActiveReportingEmptyState, {});

    initialRender();
  });

  test("should render loading when hook returns loading", () => {
    const emptyText = screen.getByText(/No known incident found/i);
    expect(emptyText).toBeInTheDocument();
  });

  test("should call handleAddReport after clicking on report button", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toHaveTextContent("REPORT AN INCIDENT");
    fireEvent.click(buttons[0]);
    const options = screen.getAllByRole("option");
    fireEvent.click(options[0]);
  });
});
