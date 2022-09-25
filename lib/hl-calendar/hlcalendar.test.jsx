import { initiateTest } from "@/utils/unit-tests/test-mockup-fn";
import { screen } from "@/utils/unit-tests/test-utils";
import { testData } from "@/utils/unit-tests/test-data";
import { HlCalendar } from "./index";
import DateLib from "@/lib/date/DateLib";

describe("HighLight Calendar", () => {
  const { initialRender, rerenderFn } = initiateTest(HlCalendar, {
    startDate: DateLib.fromUnix(
      testData.incidentReports.data.incidentReport.incidentDate
    ),
    endDate: DateLib.fromUnix(
      testData.incidentReports.data.incidentReport.resolutionTimestamp
    ),
  });

  beforeEach(() => {
    initialRender();
  });

  test("Should render a calendar", () => {
    const table = screen.getByTestId("hlcalendar");

    expect(table).toBeInTheDocument();
  });

  test("With Highlighted value", () => {
    const day15 = screen.getByText("15");

    expect(day15.parentElement).toHaveClass("bg-DEEAF6");
  });

  test("Resolved at the same day", () => {
    const dates = {
      startDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-10-05"))),
      endDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-10-05"))),
    };
    rerenderFn(dates);

    const startDate = screen
      .getAllByText(String(dates.startDate.getDate()))
      .shift();

    expect(startDate.parentElement).toHaveClass("bg-DEEAF6");
  });

  test("Bug Scenario where startDate is greater than resolution date ", () => {
    const dates = {
      startDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-11-5"))),
      endDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-12-28"))),
    };
    rerenderFn(dates);

    const startDate = screen
      .getAllByText(String(dates.startDate.getDate()))
      .pop();
    const endDate = screen
      .getAllByText(String(dates.endDate.getDate()))
      .shift();

    expect(startDate.parentElement).toHaveClass("bg-DEEAF6");
    expect(endDate.parentElement).toHaveClass("bg-DEEAF6");
  });

  test("Bug Scenario where startDate is greater than resolution date ", () => {
    const dates = {
      startDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-11-15"))),
      endDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-12-8"))),
    };
    rerenderFn(dates);

    const endDate = screen.getAllByText("7").shift();

    expect(endDate.parentElement).toHaveClass("bg-DEEAF6");
  });

  test("Resolved after 7 days at the same month", () => {
    const dates = {
      startDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-10-05"))),
      endDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-10-12"))),
    };
    rerenderFn(dates);

    const startDate = screen
      .getAllByText(String(dates.startDate.getDate()))
      .shift();
    const endDate = screen.getByText(String(dates.endDate.getDate()));

    expect(startDate.parentElement).toHaveClass("bg-DEEAF6");
    expect(endDate.parentElement).toHaveClass("bg-DEEAF6");
  });

  test("Resolved after 7 days and New year", () => {
    const dates = {
      startDate: DateLib.fromUnix(DateLib.toUnix(new Date("2022-12-31"))),
      endDate: DateLib.fromUnix(DateLib.toUnix(new Date("2023-01-07"))),
    };
    rerenderFn(dates);

    const endDate = screen.getByText(String(dates.endDate.getDate()));

    expect(endDate.parentElement).toHaveClass("bg-DEEAF6");
  });
});
