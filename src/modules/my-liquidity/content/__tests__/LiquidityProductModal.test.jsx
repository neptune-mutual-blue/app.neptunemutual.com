import { LiquidityProductModal } from "@/modules/my-liquidity/content/LiquidityProductModal";
import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { fireEvent, screen } from "@testing-library/react";

describe("LiquidityProductModal", () => {
  const props = {
    product: testData.coverInfoWithProducts.products[0],
    setShowModal: jest.fn(),
  };
  const { initialRender } = initiateTest(LiquidityProductModal, props);

  beforeEach(() => {
    initialRender();
  });

  test("should render the main container", () => {
    const container = screen.getByTestId("liquidity-product-modal");
    expect(container).toBeInTheDocument();
  });

  test("should render the dialog close button", () => {
    const closeButton = screen
      .getByTestId("dialog-title")
      .querySelector("button");
    expect(closeButton).toBeInTheDocument();
  });

  test("should render correct product name", () => {
    const productName = screen
      .getByTestId("dialog-title")
      .querySelector("span");

    const expectedText = `${props.product.infoObj.productName} Cover Terms`;
    expect(productName.textContent).toBe(expectedText);
  });

  test("should render the correct number of cover rules", () => {
    const rules = screen.getByTestId("cover-rules").querySelectorAll("li");

    const expectedRules = props.product.infoObj.rules.split("\n");
    expect(rules.length).toBe(expectedRules.length);
  });

  test("should render correct rule text", () => {
    const rule = screen.getByTestId("cover-rules").querySelector("li");

    const expectedRule = `${props.product.infoObj.rules
      .split("\n")[0]
      .trim()
      .replace(/^\d+\./g, "")
      .trim()}`;
    expect(rule.textContent).toBe(expectedRule);
  });

  test("should render correct exclusions", () => {
    const exclusions = screen.getByTestId("cover-exclusions");
    expect(exclusions.textContent).toBe(props.product.infoObj.exclusions);
  });

  test("should rende the close button", () => {
    const closeButton = screen.getByTestId("close-button");
    expect(closeButton).toBeInTheDocument();
  });

  test("simulating close button click", () => {
    const closeButton = screen.getByTestId("close-button");
    closeButton.click();

    expect(props.setShowModal).toHaveBeenCalledWith(false);
  });

  test("should render the download button", () => {
    const downloadButton = screen.getByTestId("download-button");
    expect(downloadButton).toBeInTheDocument();
  });

  test("simulating download button click", () => {
    const downloadButton = screen.getByTestId("download-button");
    downloadButton.click();

    expect(props.setShowModal).toHaveBeenCalledWith(false);
  });

  test("simulating escape key press to close modal", () => {
    const container = screen.getByTestId("liquidity-product-modal");
    fireEvent.keyDown(container, {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    });
    expect(props.setShowModal).toHaveBeenCalledWith(false);
  });
});
