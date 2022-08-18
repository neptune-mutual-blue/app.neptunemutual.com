import { i18n } from "@lingui/core";
import { render } from "@/utils/unit-tests/test-utils";
import { VotesSummaryHorizontalChart } from "@/modules/reporting/VotesSummaryHorizontalChart";
import { testData } from "@/utils/unit-tests/test-data";
import { convertFromUnits } from "@/utils/bn";

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

describe("VotesSummaryHorizontalChart test", () => {
  let screen;
  beforeEach(() => {
    i18n.activate("en");

    const incidentReport = testData.incidentReports.data.incidentReport;

    let isAttestedWon = incidentReport.decision;
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

    const majority = {
      voteCount: isAttestedWon
        ? incidentReport.totalAttestedCount
        : incidentReport.totalRefutedCount,
      stake: isAttestedWon ? votes.yes : votes.no,
      percent: isAttestedWon ? yesPercent : noPercent,
      variant: isAttestedWon ? "success" : "failure",
    };

    screen = render(
      <VotesSummaryHorizontalChart
        yesPercent={yesPercent}
        noPercent={noPercent}
        showTooltip={incidentReport.resolved}
        majority={majority}
      />
    );
  });

  test("should render the charts", async () => {
    const canvas = screen.container.getElementsByTagName("canvas");
    expect(canvas.length).toBe(1);
  });
});
