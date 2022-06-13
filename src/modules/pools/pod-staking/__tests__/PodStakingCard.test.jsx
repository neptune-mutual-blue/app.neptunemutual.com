import React from "react";
import {
  render,
  act,
  cleanup,
  screen,
  fireEvent,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import { PodStakingCard } from "@/modules/pools/pod-staking/PodStakingCard";
import * as Network from "@/src/context/Network";
import * as SortableStats from "@/src/context/SortableStatsContext";
import * as PoolInfo from "@/src/hooks/usePoolInfo";
import { getTokenImgSrc } from "@/src/helpers/token";
import { formatPercent } from "@/utils/formatter/percent";
import { getApr } from "@/src/services/protocol/staking-pool/info/apr";
import { formatCurrency } from "@/utils/formatter/currency";
import { convertFromUnits } from "@/utils/bn";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

const mockNetwordData = { networkId: 80001 };

const mockPoolInfoData = {
  info: {
    stakingPoolsContractAddress: "0x0ff47939639D6213D27b5217f317665008aCdE3E",
    name: "Earn XD",
    stakingToken: "0x90BB63b9C01b1cf1EF4Fd834Ddd25d6AE3BB3e56",
    stakingTokenStablecoinPair: "0x0000000000000000000000000000000000000000",
    rewardToken: "0xfE580ca5A2876e85489AbA1FdfCe172186302a9e",
    rewardTokenStablecoinPair: "0x9123f59C472f8186CBa11833975c08494FAB450E",
    totalStaked: "61100000000000000000000",
    target: "800000000000000000000000",
    maximumStake: "20000000000000000000000",
    stakeBalance: "21100000000000000000000",
    cumulativeDeposits: "61100000000000000000000",
    rewardPerBlock: "6400000000",
    platformFee: "25",
    lockupPeriodInBlocks: "1200",
    rewardTokenBalance: "34999983560448000000000000",
    lastRewardHeight: "0",
    lastDepositHeight: "0",
    myStake: "0",
    totalBlockSinceLastReward: "0",
    rewards: "0",
    canWithdrawFromBlockHeight: "1200",
    stakingTokenPrice: "1000000000000000000",
    rewardTokenPrice: "1930279026536796441",
    apr: "0.12996182629866943",
  },
  refetch: jest.fn(),
};

const props = {
  data: {
    id: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
    key: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
    name: "Earn BEC",
    poolType: "PODStaking",
    stakingToken: "0x148ec3a5d403c4de2efb3995e7ab95139337dae8",
    stakingTokenName: "bb8-exchange-ndai",
    stakingTokenSymbol: "nDAI",
    uniStakingTokenDollarPair: "0x0000000000000000000000000000000000000000",
    rewardToken: "0xc6aa2672f65617296ce65b67dc035f65adfe0701",
    rewardTokenName: "Fake Bb8 Exchange",
    rewardTokenSymbol: "BEC",
    uniRewardTokenDollarPair: "0xbf97bbba44b5d0225179757f0eb33a52297f3828",
    rewardTokenDeposit: "18000000000000000000000000",
    maxStake: "20000000000000000000000",
    rewardPerBlock: "4566764500",
    lockupPeriodInBlocks: "1200",
    platformFee: "25",
    tvl: "36023415510680653787764225",
    apr: "0.09613510806640226068125255226151082117235838421205184343029845835434840473688674",
  },
  tvl: "36023415510680653787764225",
  getPriceByAddress: jest.fn((e) => {
    if (e === mockPoolInfoData.info.stakingToken) return "1.00028";
    else if (e === mockPoolInfoData.info.rewardToken) return "1";
  }),
};

const mockSortableStatsData = {
  setStatsByKey: jest.fn(),
};

const initalMocks = () => {
  mockFunction(Network, "useNetwork", () => mockNetwordData);
  mockFunction(SortableStats, "useSortableStats", () => mockSortableStatsData);
  mockFunction(PoolInfo, "usePoolInfo", () => mockPoolInfoData);
};

describe("PodStakingCard test", () => {
  const initialRender = (newProps = {}, rerender = false) => {
    if (!rerender) initalMocks();
    act(() => {
      i18n.activate("en");
    });
    render(<PodStakingCard {...props} {...newProps} />);
  };

  const rerender = (newProps = {}, mockParameters = []) => {
    if (mockParameters.length) {
      mockParameters.map((mock) => {
        mockFunction(mock.file, mock.method, mock.returnFn);
      });
    }

    cleanup();
    initialRender(newProps, true);
  };

  beforeEach(() => {
    cleanup();
    initialRender();
  });

  test("should render the wrapper container", () => {
    const card = screen.getByTestId("pod-staking-card");
    expect(card).toBeInTheDocument();
  });

  test("should have correct image", () => {
    const altText = props.data.rewardTokenSymbol;
    const img = screen.getByAltText(altText);
    expect(img).toBeInTheDocument();
  });

  test("image should have correct src", () => {
    const altText = props.data.rewardTokenSymbol;
    const src = getTokenImgSrc(props.data.rewardTokenSymbol);
    const img = screen.getByAltText(altText);
    expect(img).toHaveAttribute("src", src);
  });

  test("should have correct card title", () => {
    const title = mockPoolInfoData.info.name;
    const cardTitle = screen.getByText(title);
    expect(cardTitle).toBeInTheDocument();
  });

  test("should have correct card subtitle", () => {
    const subtitle = `Stake ${props.data.stakingTokenName}`;
    const cardSubtitle = screen.getByText(subtitle);
    expect(cardSubtitle).toBeInTheDocument();
  });

  test("should  display correct badge text", () => {
    // data
    const apr = getApr(mockNetwordData.networkId, {
      stakingTokenPrice: props.getPriceByAddress(
        mockPoolInfoData.info.stakingToken
      ),
      rewardPerBlock: mockPoolInfoData.info.rewardPerBlock,
      rewardTokenPrice: props.getPriceByAddress(
        mockPoolInfoData.info.rewardToken
      ),
    });
    const badgeText = `APR: ${formatPercent(apr, "en")}`;

    const badge = screen.getByText(badgeText);
    expect(badge).toBeInTheDocument();
  });

  test("should render correct number of card stats", () => {
    const cardStats = screen.getAllByTestId("pod-staking-card-stat");
    expect(cardStats).toHaveLength(2);
  });

  test("should not render Pool stat cards & staking cards when stake is 0", () => {
    const poolStatCard = screen.queryByTestId("pool-card-stat");
    const stakingCards = screen.queryAllByTestId("staking-cards");
    expect(poolStatCard).not.toBeInTheDocument();
    expect(stakingCards).toHaveLength(0);
  });

  test("should render Pool stat cards & staking cards when stake is greater than 0", () => {
    rerender({}, [
      {
        file: PoolInfo,
        method: "usePoolInfo",
        returnFn: () => ({
          ...mockPoolInfoData,
          info: {
            ...mockPoolInfoData.info,
            myStake: "1000000000000000000",
          },
        }),
      },
    ]);
    const poolStatCard = screen.queryByTestId("pool-card-stat");
    const stakingCards = screen.queryAllByTestId("staking-cards");
    expect(poolStatCard).toBeInTheDocument();
    expect(stakingCards.length).toBeGreaterThanOrEqual(1);
  });

  test("should have correct value in pool stat card", () => {
    rerender({}, [
      {
        file: PoolInfo,
        method: "usePoolInfo",
        returnFn: () => ({
          ...mockPoolInfoData,
          info: {
            ...mockPoolInfoData.info,
            myStake: "1000000000000000000",
          },
        }),
      },
    ]);
    const poolStatCard = screen.getByTestId("pool-card-stat");
    const poolStatValue = formatCurrency(
      convertFromUnits(mockPoolInfoData.info.rewards),
      "en",
      props.data.rewardTokenSymbol,
      true
    ).short;
    expect(poolStatCard).toHaveTextContent(poolStatValue);
  });

  test("should render the stake button if stake is 0", () => {
    const stakeBtn = screen.getByText("Stake");
    expect(stakeBtn).toBeInTheDocument();
  });

  describe("modals", () => {
    beforeEach(() => {
      rerender({}, [
        {
          file: PoolInfo,
          method: "usePoolInfo",
          returnFn: () => ({
            ...mockPoolInfoData,
            info: {
              ...mockPoolInfoData.info,
              myStake: "1000000000000000000",
            },
          }),
        },
      ]);
    });

    test("should not render the stake modal by default", () => {
      let stakeModal = screen.queryByTestId("stake-modal");
      expect(stakeModal).not.toBeInTheDocument();
    });

    test("should render the stake modal when add button is clicked", () => {
      const addBtn = screen.getByTestId("add-btn");
      fireEvent.click(addBtn);

      const stakeModal = screen.queryByTestId("staking-modal");
      expect(stakeModal).toBeInTheDocument();
    });

    test("should not render the collect reward modal by default", () => {
      let rewardModal = screen.queryByTestId("collect-reward-modal");
      expect(rewardModal).not.toBeInTheDocument();
    });

    test("should render the collect reward modal when collect button is clicked", () => {
      const collectBtn = screen.getByTestId("collect-btn");
      fireEvent.click(collectBtn);

      const rewardModal = screen.queryByTestId("collect-reward-modal");
      expect(rewardModal).toBeInTheDocument();
    });
  });
});
