import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";
import Index from "@/src/pages/index";

jest.mock("@/modules/home", () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="homepage"></div>;
    },
  };
});

describe("Index test", () => {
  const { initialRender } = initiateTest(Index);

  beforeEach(() => {
    initialRender();
  });

  test("should display homepage", () => {
    const homepage = screen.getByTestId("homepage");
    expect(homepage).toBeInTheDocument();
  });
});
