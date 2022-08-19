import { initiateTest, mockFn } from "@/utils/unit-tests/test-mockup-fn";
import { fireEvent, screen } from "@testing-library/react";
import { NewIncidentReportForm } from "@/src/modules/reporting/NewIncidentReportForm";
import { testData } from "@/utils/unit-tests/test-data";

describe("Incident Occured form", () => {
  const { initialRender, rerenderFn } = initiateTest(
    NewIncidentReportForm,
    {
      coverKey: "coverKey",
      productKey: "productKey",
    },
    () => {
      mockFn.useFirstReportingStake(),
        mockFn.useReportIncident(),
        mockFn.useTokenDecimals();
    }
  );

  beforeEach(() => {
    initialRender();
  });

  test("should render the Incident Report form with the default states", () => {
    const form = screen.getByTestId("incident-report-form");
    expect(form).toBeInTheDocument();

    const title = screen.getByRole("textbox", { name: "Title" });
    expect(title).not.toBeRequired();
    expect(title).toBeInTheDocument();

    const observeDateAndTime = screen.getByLabelText("Observed Date & Time");
    expect(observeDateAndTime).not.toBeRequired();
    expect(observeDateAndTime).toBeInTheDocument();

    const proofOfIncident = screen.getByRole("textbox", {
      name: "Proof of incident",
    });
    expect(proofOfIncident).not.toBeRequired();
    expect(proofOfIncident).toBeInTheDocument();

    const description = screen.getByRole("textbox", { name: "Description" });
    expect(description).not.toBeRequired();
    expect(description).toBeInTheDocument();

    const stake = screen.getByRole("textbox", { name: "Enter your stake" });
    expect(stake).toBeRequired();
    expect(stake).toBeInTheDocument();

    const approveNPMButton = screen.getByRole("button", {
      name: "Approve NPM",
    });
    expect(approveNPMButton).toBeInTheDocument();

    const inputs = screen.getAllByRole("textbox");
    /**
     * Title
     * Observed Date and Time
     * Proof of incident
     */
    expect(inputs.length).toBe(4);

    const buttons = screen.getAllByRole("button");
    /**
     * Add new url Link
     * Copy Address
     * Open In Explorer
     * Add to Metamask
     * Approved NPM
     */
    expect(buttons.length).toBe(5);
  });

  test("Form state based on canreport", () => {
    rerenderFn({}, () => {
      mockFn.useReportIncident(() => ({
        ...testData.reportIncident,
        canReport: true,
      }));
    });

    const title = screen.getByRole("textbox", { name: "Title" });
    expect(title).toBeRequired();
    expect(title).toBeInTheDocument();

    const observeDateAndTime = screen.getByLabelText("Observed Date & Time");
    expect(observeDateAndTime).toBeRequired();
    expect(observeDateAndTime).toBeInTheDocument();

    const proofOfIncident = screen.getByRole("textbox", {
      name: "Proof of incident",
    });
    expect(proofOfIncident).toBeRequired();
    expect(proofOfIncident).toBeInTheDocument();

    const description = screen.getByRole("textbox", { name: "Description" });
    expect(description).toBeRequired();
    expect(description).toBeInTheDocument();

    const stake = screen.getByRole("textbox", { name: "Enter your stake" });
    expect(stake).toBeRequired();
    expect(stake).toBeInTheDocument();
  });

  test("Set Max Balance to stake", () => {
    const max = screen.getByRole("button", { name: "Max" });
    expect(max).toBeInTheDocument();
    fireEvent.click(max);

    const textBoxStake = screen.getByRole("textbox", {
      name: "Enter your stake",
    });
    expect(textBoxStake).toHaveDisplayValue("100");
  });

  describe("Form", () => {
    test("Submit approve", () => {
      const title = screen.getByRole("textbox", { name: "Title" });
      fireEvent.change(title, { target: { value: "Test Title" } });
      expect(title).toHaveDisplayValue("Test Title");

      const observeDateAndTime = screen.getByLabelText("Observed Date & Time");
      fireEvent.change(observeDateAndTime, {
        target: { value: "2000-01-01T12:00" },
      });
      expect(observeDateAndTime).toHaveDisplayValue("2000-01-01T12:00");

      const url = screen.getByRole("textbox", { name: "Proof of incident" });
      fireEvent.change(url, {
        target: { value: "https://www.example.com/report" },
      });
      expect(url).toHaveDisplayValue("https://www.example.com/report");

      const description = screen.getByRole("textbox", { name: "Description" });
      fireEvent.change(description, { target: { value: "Test Description" } });
      expect(description).toHaveDisplayValue("Test Description");

      const stake = screen.getByRole("textbox", { name: "Enter your stake" });
      fireEvent.change(stake, { target: { value: "20" } });
      expect(stake).toHaveDisplayValue("20");

      const buttonApproved = screen.getByRole("button", {
        name: "Approve NPM",
      });
      fireEvent.click(buttonApproved);
    });

    test("Submit report", () => {
      rerenderFn({}, () => {
        mockFn.useReportIncident(() => ({
          ...testData.reportIncident,
          canReport: true,
        }));
      });

      const title = screen.getByRole("textbox", { name: "Title" });
      fireEvent.change(title, { target: { value: "Test Title" } });
      expect(title).toHaveDisplayValue("Test Title");

      const observeDateAndTime = screen.getByLabelText("Observed Date & Time");
      fireEvent.change(observeDateAndTime, {
        target: { value: "2000-01-01T12:00" },
      });
      expect(observeDateAndTime).toHaveDisplayValue("2000-01-01T12:00");

      const url = screen.getByRole("textbox", { name: "Proof of incident" });
      fireEvent.change(url, {
        target: { value: "https://www.example.com/report" },
      });
      expect(url).toHaveDisplayValue("https://www.example.com/report");

      const description = screen.getByRole("textbox", { name: "Description" });
      fireEvent.change(description, { target: { value: "Test Description" } });
      expect(description).toHaveDisplayValue("Test Description");

      const stake = screen.getByRole("textbox", { name: "Enter your stake" });
      fireEvent.change(stake, { target: { value: "20" } });
      expect(stake).toHaveDisplayValue("20");

      const buttonApproved = screen.getByRole("button", {
        name: "Report",
      });
      fireEvent.click(buttonApproved);
    });

    test("Submit report with multiple url reports", () => {
      rerenderFn({}, () => {
        mockFn.useReportIncident(() => ({
          ...testData.reportIncident,
          canReport: true,
        }));
      });

      const title = screen.getByRole("textbox", { name: "Title" });
      fireEvent.change(title, { target: { value: "Test Title" } });
      expect(title).toHaveDisplayValue("Test Title");

      const observeDateAndTime = screen.getByLabelText("Observed Date & Time");
      fireEvent.change(observeDateAndTime, {
        target: { value: "2000-01-01T12:00" },
      });
      expect(observeDateAndTime).toHaveDisplayValue("2000-01-01T12:00");

      const btnAddNewUrl = screen.getByRole("button", {
        name: "+ Add new link",
      });

      fireEvent.click(btnAddNewUrl);

      const urls = screen.getAllByPlaceholderText("https://");
      expect(urls.length).toBe(2);

      fireEvent.change(urls[0], {
        target: { value: "https://www.example.com/report" },
      });
      expect(urls[0]).toHaveDisplayValue("https://www.example.com/report");

      fireEvent.change(urls[1], {
        target: { value: "https://www.example.com/report_1" },
      });
      expect(urls[1]).toHaveDisplayValue("https://www.example.com/report_1");

      const description = screen.getByRole("textbox", { name: "Description" });
      fireEvent.change(description, { target: { value: "Test Description" } });
      expect(description).toHaveDisplayValue("Test Description");

      const stake = screen.getByRole("textbox", { name: "Enter your stake" });
      fireEvent.change(stake, { target: { value: "20" } });
      expect(stake).toHaveDisplayValue("20");

      const buttonApproved = screen.getByRole("button", {
        name: "Report",
      });
      fireEvent.click(buttonApproved);
    });
  });

  describe("Loading test", () => {
    test("loadingAllowance test", () => {
      rerenderFn({}, () => {
        mockFn.useReportIncident(() => ({
          ...testData.reportIncident,
          loadingAllowance: true,
        }));
      });

      const loading = screen.getByTestId("loaders");
      expect(loading).toHaveTextContent("Fetching allowance...");
      expect(loading).toBeInTheDocument();
    });

    test("loadingBalance test", () => {
      rerenderFn({}, () => {
        mockFn.useReportIncident(() => ({
          ...testData.reportIncident,
          loadingBalance: true,
        }));
      });

      const loading = screen.getByTestId("loaders");
      expect(loading).toHaveTextContent("Fetching balance...");
      expect(loading).toBeInTheDocument();
    });

    test("fetchingMinStake test", () => {
      rerenderFn({}, () => {
        mockFn.useFirstReportingStake(() => ({
          ...testData.firstReportingStake,
          fetchingMinStake: true,
        }));
      });

      const loading = screen.getByTestId("loaders");
      expect(loading).toHaveTextContent("Fetching min stake...");
      expect(loading).toBeInTheDocument();
    });
  });

  describe("Approve and Reporting Button", () => {
    test("Show Approving", () => {
      rerenderFn({}, () => {
        mockFn.useReportIncident(() => ({
          ...testData.reportIncident,
          approving: true,
        }));
      });

      const approving = screen.getByRole("button", { name: "Approving..." });
      expect(approving).toBeInTheDocument();
      expect(approving).toHaveAttribute("disabled", "");
    });

    test("Show Report Button", () => {
      rerenderFn({}, () => {
        mockFn.useReportIncident(() => ({
          ...testData.reportIncident,
          canReport: true,
        }));
      });

      const report = screen.getByRole("button", { name: "Report" });
      expect(report).toBeInTheDocument();
    });

    test("Show Reporting Button", () => {
      rerenderFn({}, () => {
        mockFn.useReportIncident(() => ({
          ...testData.reportIncident,
          canReport: true,
          reporting: true,
        }));
      });

      const report = screen.getByRole("button", { name: "Reporting..." });
      expect(report).toBeInTheDocument();
      expect(report).toBeInTheDocument();
    });
  });

  describe("Errors on Stake", () => {
    test("Show error Insufficient Stake", () => {
      const stakeInput = screen.getByRole("textbox", {
        name: "Enter your stake",
      });
      fireEvent.change(stakeInput, { target: { value: 10 } });

      const error = screen.getByText("Insufficient Stake");
      expect(error).toHaveClass("text-FA5C2F");
      expect(error).toBeInTheDocument();
    });

    test("Show error Insufficient Balanced", () => {
      rerenderFn({}, () => {
        mockFn.useFirstReportingStake(() => ({
          ...testData.firstReportingStake,
          minStake: "300000000000000000000",
        }));
      });
      const stakeInput = screen.getByRole("textbox", {
        name: "Enter your stake",
      });
      fireEvent.change(stakeInput, { target: { value: 1000 } });

      const error = screen.getByText("Insufficient Balanced");
      expect(error).toHaveClass("text-FA5C2F");
      expect(error).toBeInTheDocument();
    });
  });
});
