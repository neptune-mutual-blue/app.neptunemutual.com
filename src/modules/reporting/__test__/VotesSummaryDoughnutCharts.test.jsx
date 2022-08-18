import { i18n } from "@lingui/core";
import { render } from "@/utils/unit-tests/test-utils";
import { testData } from "@/utils/unit-tests/test-data";
import { convertFromUnits } from "@/utils/bn";
import { VotesSummaryDoughnutChart } from "@/modules/reporting/VotesSummaryDoughnutCharts";

global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
};

global.DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  }),
};

describe("VotesSummaryDoughnutChart test", () => {
  let screen;
  beforeEach(() => {
    i18n.activate("en");

    const yesPercent = "43%";
    const noPercent = "57%";

    const votes = {
      yes: convertFromUnits(testData.consensusInfo.info.yes)
        .decimalPlaces(0)
        .toNumber(),
      no: convertFromUnits(testData.consensusInfo.info.yes)
        .decimalPlaces(0)
        .toNumber(),
    };

    screen = render(
      <VotesSummaryDoughnutChart
        yesPercent={yesPercent}
        noPercent={noPercent}
        votes={votes}
      />
    );
  });

  test("should render doughnut chart", async () => {
    const canvas = await screen.container.getElementsByTagName("canvas");
    expect(canvas.length).toBe(2);
  });
});
