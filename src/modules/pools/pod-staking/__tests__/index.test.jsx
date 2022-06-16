import React from "react";
import {
  render,
  act,
  cleanup,
  screen,
  fireEvent,
} from "@/utils/unit-tests/test-utils";
import { i18n } from "@lingui/core";

import { PodStakingPage } from "@/modules/pools/pod-staking";
import * as PodStakingPools from "@/src/hooks/usePodStakingPools";
import * as Network from "@/src/context/Network";
import * as PoolInfo from "@/src/hooks/usePoolInfo";

const mockFunction = (file, method, returnFn) => {
  jest.spyOn(file, method).mockImplementation(returnFn);
};

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

const mockNetwordData = { networkId: 80001 };

const mockPodStakingData = {
  data: {
    pools: [
      {
        id: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
        key: "0x6262382d65786368616e67650000000000000000000000000000000000000000",
        name: "Earn BEC",
      },
      {
        id: "0x6372706f6f6c0000000000000000000000000000000000000000000000000000",
        key: "0x6372706f6f6c0000000000000000000000000000000000000000000000000000",
        name: "Earn CRPOOL",
      },
      {
        id: "0x68756f62692d77616e0000000000000000000000000000000000000000000000",
        key: "0x68756f62692d77616e0000000000000000000000000000000000000000000000",
        name: "Earn HWT",
      },
      {
        id: "0x6f626b0000000000000000000000000000000000000000000000000000000000",
        key: "0x6f626b0000000000000000000000000000000000000000000000000000000000",
        name: "Earn OBK",
      },
      {
        id: "0x73616272652d6f7261636c657300000000000000000000000000000000000000",
        key: "0x73616272652d6f7261636c657300000000000000000000000000000000000000",
        name: "Earn SABRE",
      },
      {
        id: "0x7832643200000000000000000000000000000000000000000000000000000000",
        key: "0x7832643200000000000000000000000000000000000000000000000000000000",
        name: "Earn XD",
      },
    ],
  },
  loading: false,
  hasMore: false,
  handleShowMore: jest.fn(),
};

const initalMocks = () => {
  mockFunction(Network, "useNetwork", () => mockNetwordData);
  mockFunction(PodStakingPools, "usePodStakingPools", () => mockPodStakingData);
  mockFunction(PoolInfo, "usePoolInfo", () => mockPoolInfoData);
};

describe("PodStaking Page test", () => {
  const initialRender = (newProps = {}, rerender = false) => {
    if (!rerender) initalMocks();
    act(() => {
      i18n.activate("en");
    });
    render(<PodStakingPage {...newProps} />);
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

  test("should render the main container", () => {
    const card = screen.getByTestId("pod-staking-page-container");
    expect(card).toBeInTheDocument();
  });

  test("should correctly render the SearchAndSortBar component", () => {
    const searchAndSortBar = screen.getByTestId("search-and-sort-container");
    expect(searchAndSortBar).toBeInTheDocument();
  });

  describe("Content", () => {
    test("should correctly render the Content component", () => {
      const content = screen.getByTestId("pools-grid");
      expect(content).toBeInTheDocument();
    });

    test("should render correct number of pod staking cards", () => {
      const cards = screen.getAllByTestId("pod-staking-card");
      expect(cards).toHaveLength(mockPodStakingData.data.pools.length);
    });

    test("should render the show more button if not loading and has more", () => {
      rerender({}, [
        {
          file: PodStakingPools,
          method: "usePodStakingPools",
          returnFn: () => ({
            ...mockPodStakingData,
            hasMore: true,
          }),
        },
      ]);

      const btn = screen.getByTestId("show-more-button");
      expect(btn).toBeInTheDocument();
    });

    test("should show the loading grid when loading", () => {
      rerender({}, [
        {
          file: PodStakingPools,
          method: "usePodStakingPools",
          returnFn: () => ({
            ...mockPodStakingData,
            data: { pools: [] },
            loading: true,
          }),
        },
      ]);

      const grid = screen.getByTestId("loading-grid");
      expect(grid).toBeInTheDocument();
    });

    test("should render the no pools container if not loading & pool data is empty", () => {
      rerender({}, [
        {
          file: PodStakingPools,
          method: "usePodStakingPools",
          returnFn: () => ({
            ...mockPodStakingData,
            data: { pools: [] },
          }),
        },
      ]);

      const grid = screen.getByTestId("no-pools-container");
      expect(grid).toBeInTheDocument();

      const noDataImage = screen.getByAltText("no data found");
      expect(noDataImage).toBeInTheDocument();
    });

    test("simulating clicking show more button", () => {
      rerender({}, [
        {
          file: PodStakingPools,
          method: "usePodStakingPools",
          returnFn: () => ({
            ...mockPodStakingData,
            hasMore: true,
          }),
        },
      ]);

      const btn = screen.getByTestId("show-more-button");
      fireEvent.click(btn);
      expect(mockPodStakingData.handleShowMore).toHaveBeenCalled();
    });
  });
});
