import { MULTIPLIER } from "@/src/config/constants";
import { ethers } from "ethers";
import { consensus } from "../../../store-keys";

export const getKeys = async (key, account, incidentDate) => {
  return [
    consensus.coverStatusOf(key, incidentDate, "decision"),
    consensus.totalStakeIncidentOccurred(key, incidentDate, "yes"),
    consensus.totalStakeFalseReporting(key, incidentDate, "no"),
    consensus.myStakeIncidentOccurred(key, incidentDate, account, "myYes"),
    consensus.myStakeFalseReporting(key, incidentDate, account, "myNo"),
    consensus.myUnstakenAmount(key, incidentDate, account, "unstaken"),
    consensus.myRewardsUnstaken(key, incidentDate, account, "rewardsUnstaken"),
    consensus.latestIncidentDate(key, "latestIncidentDate"),
    consensus.stakeForfeitBurnRate("burnRate"),
    consensus.stakeForfeitReporterComissionRate("reporterCommission"),
    {
      returns: "uint256",
      property: "totalStakeInWinningCamp",
      compute: async ({ result }) => {
        const { decision, yes, no } = result;

        const incidentHappened =
          decision.toNumber() === consensus.CoverStatus.IncidentHappened ||
          decision.toNumber() === consensus.CoverStatus.Claimable;

        if (incidentHappened) {
          return yes;
        }

        return no;
      },
    },
    {
      returns: "uint256",
      property: "totalStakeInLosingCamp",
      compute: async ({ result }) => {
        const { decision, yes, no } = result;

        const incidentHappened =
          decision.toNumber() === consensus.CoverStatus.IncidentHappened ||
          decision.toNumber() === consensus.CoverStatus.Claimable;

        if (incidentHappened) {
          return no;
        }

        return yes;
      },
    },
    {
      returns: "uint256",
      property: "myStakeInWinningCamp",
      compute: async ({ result }) => {
        const { decision, myYes, myNo } = result;

        const incidentHappened =
          decision.toNumber() === consensus.CoverStatus.IncidentHappened ||
          decision.toNumber() === consensus.CoverStatus.Claimable;

        if (incidentHappened) {
          return myYes;
        }

        return myNo;
      },
    },
    {
      returns: "uint256",
      property: "allocatedReward",
      compute: async ({ result }) => {
        const {
          myStakeInWinningCamp,
          totalStakeInWinningCamp,
          totalStakeInLosingCamp,
          latestIncidentDate,
        } = result;

        if (latestIncidentDate.toString() !== incidentDate.toString()) {
          return ethers.BigNumber.from("0");
        }

        if (totalStakeInWinningCamp.eq("0")) {
          return totalStakeInWinningCamp;
        }

        const ratio = myStakeInWinningCamp
          .mul(MULTIPLIER.toString())
          .div(totalStakeInWinningCamp);

        return totalStakeInLosingCamp.mul(ratio).div(MULTIPLIER.toString());
      },
    },
    {
      returns: "uint256",
      property: "toBurn",
      compute: async ({ result }) => {
        const { allocatedReward, burnRate } = result;
        return allocatedReward.mul(burnRate).div(MULTIPLIER.toString());
      },
    },
    {
      returns: "uint256",
      property: "toReporter",
      compute: async ({ result }) => {
        const { allocatedReward, reporterCommission } = result;
        return allocatedReward
          .mul(reporterCommission)
          .div(MULTIPLIER.toString());
      },
    },
    {
      returns: "uint256",
      property: "myReward",
      compute: async ({ result }) => {
        const { allocatedReward, toBurn, toReporter } = result;
        return allocatedReward.sub(toBurn).sub(toReporter);
      },
    },
    {
      returns: "uint256",
      property: "willReceive",
      compute: async ({ result }) => {
        const { myStakeInWinningCamp, myReward, unstaken, rewardsUnstaken } =
          result;
        return myStakeInWinningCamp
          .add(myReward)
          .sub(unstaken)
          .sub(rewardsUnstaken);
      },
    },
  ];
};
