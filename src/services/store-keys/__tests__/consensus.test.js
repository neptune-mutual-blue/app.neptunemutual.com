import * as consensus from "@/src/services/store-keys/consensus";

const {
  totalStakeIncidentOccurred,
  coverProductStatusOf,
  claimPayoutsOf,
  myStakeIncidentOccurred,
  totalStakeFalseReporting,
  myStakeFalseReporting,
  myUnstakenAmount,
  myRewardsUnstaken,
  latestIncidentDate,
  stakeForfeitBurnRate,
  stakeForfeitReporterComissionRate,
} = consensus;

describe("consensus test", () => {
  test("coverProductStatusOf test", () => {
    const obj = totalStakeIncidentOccurred("cover", "product", "date");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a7265703a7769746e6573733a79657300000000000000000000",
        "cover",
        "product",
        "date",
      ],
      signature: ["bytes32", "bytes32", "bytes32", "uint256"],
      returns: "uint256",
      property: "yes",
    });
  });

  test("coverProductStatusOf test", () => {
    const obj = coverProductStatusOf("cover", "product", "date");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a636f7665723a7374617475730000000000000000000000000000000000",
        "cover",
        "product",
        "date",
      ],
      signature: ["bytes32", "bytes32", "bytes32", "uint256"],
      returns: "uint256",
      property: "coverProductStatus",
    });
  });

  test("claimPayoutsOf test", () => {
    const obj = claimPayoutsOf("cover", "product", "date");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a636c61696d3a7061796f75747300000000000000000000000000000000",
        "cover",
        "product",
        "date",
      ],
      signature: ["bytes32", "bytes32", "bytes32", "uint256"],
      returns: "uint256",
      property: "claimPayoutsOf",
    });
  });

  test("myStakeIncidentOccurred test", () => {
    const obj = myStakeIncidentOccurred("cover", "product", "date");

    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a7265703a7374616b653a6f776e65643a796573000000000000",
        "cover",
        "product",
        "date",
        undefined,
      ],
      signature: ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      returns: "uint256",
      property: "myYes",
    });
  });

  test("totalStakeFalseReporting test", () => {
    const obj = totalStakeFalseReporting("cover", "product", "date");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a7265703a7769746e6573733a6e6f0000000000000000000000",
        "cover",
        "product",
        "date",
      ],
      signature: ["bytes32", "bytes32", "bytes32", "uint256"],
      returns: "uint256",
      property: "no",
    });
  });

  test("myStakeFalseReporting test", () => {
    const obj = myStakeFalseReporting("cover", "product", "date", "account");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a7265703a7374616b653a6f776e65643a6e6f00000000000000",
        "cover",
        "product",
        "date",
        "account",
      ],
      signature: ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      returns: "uint256",
      property: "myNo",
    });
  });

  test("myUnstakenAmount test", () => {
    const obj = myUnstakenAmount("cover", "product", "date", "account");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a756e7374616b656e0000000000000000000000000000000000",
        "cover",
        "product",
        "date",
        "account",
      ],
      signature: ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      returns: "uint256",
      property: "unstaken",
    });
  });

  test("myRewardsUnstaken test", () => {
    const obj = myRewardsUnstaken("cover", "product", "date", "account");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a756e7374616b653a7265776172640000000000000000000000",
        "cover",
        "product",
        "date",
        "account",
      ],
      signature: ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      returns: "uint256",
      property: "rewardsUnstaken",
    });
  });

  test("latestIncidentDate test", () => {
    const obj = latestIncidentDate("cover", "product");
    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a7265703a696e636964656e743a646174650000000000000000",
        "cover",
        "product",
      ],
      returns: "uint256",
      property: "latestIncidentDate",
    });
  });

  test("stakeForfeitBurnRate test", () => {
    const obj = stakeForfeitBurnRate();
    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a7265703a6275726e3a72617465000000000000000000000000",
      ],
      returns: "uint256",
      property: "burnRate",
    });
  });

  test("stakeForfeitReporterComissionRate test", () => {
    const obj = stakeForfeitReporterComissionRate();

    expect(obj).toMatchObject({
      key: [
        "0x6e733a676f763a7265706f727465723a636f6d6d697373696f6e000000000000",
      ],
      returns: "uint256",
      property: "reporterCommissionRate",
    });
  });
});
