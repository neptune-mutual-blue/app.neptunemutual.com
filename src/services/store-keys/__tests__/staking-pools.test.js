import * as staking from "@/src/services/store-keys/staking-pools";

const {
  name,
  stakingToken,
  stakingTokenStablecoinPair,
  rewardToken,
  rewardTokenStablecoinPair,
  totalStakedInPool,
  stakingTarget,
  maximumStake,
  stakingTokenBalance,
  cumulativeDeposits,
  rewardPerBlock,
  platformFee,
  lockupPeriodInBlocks,
  rewardTokenBalance,
  lastRewardHeight,
  lastDepositHeight,
  myStake,
} = staking;

describe("staking-pools test", () => {
  test("name", () => {
    const obj = name("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7374616b696e670000000000000000000000000000000000",
        "pool",
      ],
      returns: "string",
      property: "name",
    });
  });
  test("stakingToken", () => {
    const obj = stakingToken("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7374616b696e673a746f6b656e0000000000000000000000",
        "pool",
      ],
      returns: "address",
      property: "stakingToken",
    });
  });

  test("stakingTokenStablecoinPair", () => {
    const obj = stakingTokenStablecoinPair("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7374616b696e673a746f6b656e3a756e693a706169720000",
        "pool",
      ],
      returns: "address",
      property: "stakingTokenStablecoinPair",
    });
  });

  test("rewardToken", () => {
    const obj = rewardToken("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7265776172643a746f6b656e000000000000000000000000",
        "pool",
      ],
      returns: "address",
      property: "rewardToken",
    });
  });

  test("rewardTokenStablecoinPair", () => {
    const obj = rewardTokenStablecoinPair("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7265776172643a746f6b656e3a756e693a70616972000000",
        "pool",
      ],
      returns: "address",
      property: "rewardTokenStablecoinPair",
    });
  });

  test("totalStakedInPool", () => {
    const obj = totalStakedInPool("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7374616b696e673a63756d3a616d6f756e74000000000000",
        "pool",
      ],
      returns: "uint256",
      property: "totalStakedInPool",
    });
  });

  test("stakingTarget", () => {
    const obj = stakingTarget("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7374616b696e673a74617267657400000000000000000000",
        "pool",
      ],
      returns: "uint256",
      property: "target",
    });
  });
  test("maximumStake", () => {
    const obj = maximumStake("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7265776172643a746f6b656e000000000000000000000000",
        "pool",
      ],
      returns: "uint256",
      property: "maximumStake",
    });
  });

  test("stakingTokenBalance", () => {
    const obj = stakingTokenBalance("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7374616b696e673a746f6b656e3a62616c616e6365000000",
        "pool",
      ],
      returns: "uint256",
      property: "stakingTokenBalance",
    });
  });

  test("cumulativeDeposits", () => {
    const obj = cumulativeDeposits("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7374616b696e673a63756d3a616d6f756e74000000000000",
        "pool",
      ],
      returns: "uint256",
      property: "cumulativeDeposits",
    });
  });

  test("rewardPerBlock", () => {
    const obj = rewardPerBlock("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7265776172643a7065723a626c6f636b0000000000000000",
        "pool",
      ],
      returns: "uint256",
      property: "rewardPerBlock",
    });
  });

  test("platformFee", () => {
    const obj = platformFee("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7265776172643a706c6174666f726d3a6665650000000000",
        "pool",
      ],
      returns: "uint256",
      property: "platformFee",
    });
  });

  test("lockupPeriodInBlocks", () => {
    const obj = lockupPeriodInBlocks("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7374616b696e673a6c6f636b75703a706572696f64000000",
        "pool",
      ],
      returns: "uint256",
      property: "lockupPeriodInBlocks",
    });
  });

  test("rewardTokenBalance", () => {
    const obj = rewardTokenBalance("pool");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a706f6f6c3a7265776172643a746f6b656e3a62616c616e636500000000",
        "pool",
      ],
      returns: "uint256",
      property: "rewardTokenBalance",
    });
  });

  test("lastRewardHeight", () => {
    const obj = lastRewardHeight("pool", "account");
    expect(obj).toMatchObject({
      signature: ["bytes32", "bytes32", "address"],
      key: [
        "0x6e733a706f6f6c3a7265776172643a6865696768747300000000000000000000",
        "pool",
        "account",
      ],
      returns: "uint256",
      property: "lastRewardHeight",
    });
  });

  test("lastDepositHeight", () => {
    const obj = lastDepositHeight("pool", "account");
    expect(obj).toMatchObject({
      signature: ["bytes32", "bytes32", "address"],
      key: [
        "0x6e733a706f6f6c3a6465706f7369743a68656967687473000000000000000000",
        "pool",
        "account",
      ],
      returns: "uint256",
      property: "lastDepositHeight",
    });
  });

  test("myStake", () => {
    const obj = myStake("pool", "account");
    expect(obj).toMatchObject({
      signature: ["bytes32", "bytes32", "address"],
      key: [
        "0x6e733a706f6f6c3a7374616b696e673a746f6b656e3a62616c616e6365000000",
        "pool",
        "account",
      ],
      returns: "uint256",
      property: "myStake",
    });
  });
});
