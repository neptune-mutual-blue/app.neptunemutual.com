import { Select } from "@/common/Select";
import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen, fireEvent } from "@testing-library/react";

describe("Select", () => {
  const { initialRender } = initiateTest(Select, testData.selectProps);

  beforeEach(() => {
    initialRender();
  });

  test("should render the component properly", () => {
    const wrapper = screen.getByTestId("select-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should have correct text in the select button", () => {
    const button = screen.getByTestId("select-button");

    const expectedText = `${testData.selectProps.prefix}${testData.selectProps.selected.name}`;
    expect(button).toHaveTextContent(expectedText);
  });

  test("should not render the options container by default", () => {
    const options = screen.queryByTestId("options-container");
    expect(options).not.toBeInTheDocument();
  });

  test("should render the options container once the button is clicked", () => {
    const button = screen.getByTestId("select-button");
    fireEvent.click(button);
    const options = screen.queryByTestId("options-container");
    expect(options).toBeInTheDocument();
  });

  test("option item should have correct text", () => {
    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    const option = screen
      .getByTestId("options-container")
      .querySelector("li:nth-child(1)");
    expect(option).toHaveTextContent(testData.selectProps.options[0].name);
  });

  test("should call the setSelected function when option is clicked", () => {
    const button = screen.getByTestId("select-button");
    fireEvent.click(button);

    const option2 = screen
      .getByTestId("options-container")
      .querySelector("li:nth-child(2)");
    fireEvent.click(option2);

    expect(testData.selectProps.setSelected).toHaveBeenCalled();
  });
});
