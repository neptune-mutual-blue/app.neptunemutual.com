import { DiversifiedCoverRules } from "@/modules/my-liquidity/content/rules";
import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

describe("DiversifiedCoverRules", () => {
  const props = {
    coverInfo: testData.coverInfo,
  };
  const { initialRender } = initiateTest(DiversifiedCoverRules, props);

  beforeEach(() => {
    initialRender();
  });

  test("should render the download button", () => {
    const downloadButton = screen.getByTestId("download-button");
    expect(downloadButton).toBeInTheDocument();
  });

  test("should render the warning message component", () => {
    const wrapper = screen.getByTestId("warning-message");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the notes component", () => {
    const wrapper = screen.getByTestId("notes");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render correct cover name", () => {
    const wrapper = screen.getByTestId("notes");
    expect(wrapper.textContent).toContain(props.coverInfo.infoObj.coverName);
  });
});
