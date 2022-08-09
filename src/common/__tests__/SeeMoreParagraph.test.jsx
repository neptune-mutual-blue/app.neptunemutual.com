import { SeeMoreParagraph } from "@/common/SeeMoreParagraph";
import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@testing-library/react";

const props = {
  text: "The 1inch Network unites decentralized protocols whose synergy enables the most lucrative, fastest, and protected operations in the DeFi space by offering access to hundreds of liquidity sources across multiple chains. The 1inch Network was launched at the ETHGlobal New York hackathon in May 2019 with the release of its Aggregation Protocol v1. Since then, 1inch Network has developed additional DeFi tools such as the Liquidity Protocol, Limit Order Protocol, P2P transactions, and 1inch Mobile Wa...",
};
describe("SeeMoreParagrapgh component", () => {
  // jest.spyOn(RefHook, "useRef").mockImplementation(() => ({
  //   current: {
  //     scrollHeight: 100,
  //     offsetHeight: 0,
  //   },
  // }));
  jest.mock("react", () => {
    const originReact = jest.requireActual("react");
    const mUseRef = jest.fn();
    return {
      ...originReact,
      useRef: mUseRef,
    };
  });

  const { initialRender } = initiateTest(SeeMoreParagraph, props);

  beforeEach(() => {
    initialRender();
  });

  test("should render the text content", () => {
    const text = screen.getByTestId("text-wrapper");
    expect(text).toBeInTheDocument();
  });
});
