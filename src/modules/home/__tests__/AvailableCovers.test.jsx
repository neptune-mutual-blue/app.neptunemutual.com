import React from "react";
import {
  render,
  screen,
  act,
  cleanup,
  fireEvent,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";
import { AvailableCovers } from "@/modules/home/AvailableCovers";
import * as Covers from "@/src/context/Covers";
import { CARDS_PER_PAGE } from "@/src/config/constants";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";

const availableCovers = [
  {
    key: "0x616e696d617465642d6272616e64730000000000000000000000000000000001",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    key: "0x6262382d65786368616e67650000000000000000000000000000000000000002",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
  {
    key: "0x616e696d617465642d6272616e64730000000000000000000000000000000003",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    key: "0x6262382d65786368616e67650000000000000000000000000000000000000004",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
  {
    key: "0x616e696d617465642d6272616e64730000000000000000000000000000000005",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    key: "0x6262382d65786368616e67650000000000000000000000000000000000000006",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
  {
    key: "0x616e696d617465642d6272616e64730000000000000000000000000000000007",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    key: "0x6262382d65786368616e67650000000000000000000000000000000000000008",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
  {
    key: "0x616e696d617465642d6272616e64730000000000000000000000000000000009",
    coverName: "Animated Brands",
    projectName: "Animated Brands",
    tags: ["Smart Contract", "NFT", "Gaming"],
  },
  {
    key: "0x6262382d65786368616e67650000000000000000000000000000000000000010",
    coverName: "Bb8 Exchange Cover",
    projectName: "Bb8 Exchange",
    tags: ["Smart Contract", "DeFi", "Exchange"],
  },
];

const mockFunction = (file, method, returnData) => {
  jest.spyOn(file, method).mockImplementation(() => returnData);
};

describe("AvailableCovers test", () => {
  beforeEach(() => {
    act(() => {
      i18n.activate("en");
    });

    mockFunction(Covers, "useCovers", {
      covers: availableCovers,
      loading: false,
    });

    render(<AvailableCovers />);
  });

  test("should render the component correctly", () => {
    const wrapper = screen.getByTestId("available-covers-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the `Available Covers` text element", () => {
    const wrapper = screen.getByText("Available Covers");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the SearchAndSortBar component", () => {
    const wrapper = screen.getByTestId("search-and-sort-container");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render the `No data found` if not loading & no available covers", () => {
    mockFunction(Covers, "useCovers", {
      covers: [],
      loading: false,
    });
    cleanup();
    render(<AvailableCovers />);
    const wrapper = screen.getByTestId("no-data");
    expect(wrapper).toBeInTheDocument();
  });

  test("should render correct no. of cover links", () => {
    const links = screen.getAllByTestId("cover-link");
    expect(links.length).toBe(CARDS_PER_PAGE);
  });

  test("should render correct cover link href", () => {
    const href = `/cover/${safeParseBytes32String(
      availableCovers[0].key
    )}/options`;
    const link = screen.getAllByTestId("cover-link")[0];
    expect(link).toHaveAttribute("href", href);
  });

  test("should render `Show More` button by default", () => {
    const btn = screen.getByTestId("show-more-button");
    expect(btn).toBeInTheDocument();
  });

  test("should show more cover cards on `Show More` button click", () => {
    const btn = screen.getByTestId("show-more-button");
    fireEvent.click(btn);

    const coverNumbers =
      availableCovers.length >= CARDS_PER_PAGE * 2
        ? CARDS_PER_PAGE * 2
        : availableCovers.length;
    const links = screen.getAllByTestId("cover-link");
    expect(links.length).toBe(coverNumbers);
  });

  test("testing by setting the `loading` state to true", () => {
    mockFunction(Covers, "useCovers", {
      covers: [],
      loading: true,
    });
    cleanup();
    render(<AvailableCovers />);
    const noData = screen.queryByTestId("no-data");
    expect(noData).not.toBeInTheDocument();
    const links = screen.queryAllByTestId("cover-link");
    expect(links.length).toBe(0);
  });

  test("simulating input search", () => {
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Animated" } });
    expect(input).toBeInTheDocument();
  });
});
