import * as registry from "@/src/services/store-keys/registry";

const { stakingPools, policy, governance, stablecoin, vault, priceDiscovery } =
  registry;

describe("registry test", () => {
  test("stakingPools test", () => {
    const obj = stakingPools();
    expect(obj).toMatchObject({
      key: [
        "0x6e733a636f6e7472616374730000000000000000000000000000000000000000",
        "0x636e733a706f6f6c733a7374616b696e67000000000000000000000000000000",
      ],
      returns: "address",
      property: "stakingPools",
    });
  });
  test("policy test", () => {
    const obj = policy();
    expect(obj).toMatchObject({
      key: [
        "0x6e733a636f6e7472616374730000000000000000000000000000000000000000",
        "0x636e733a636f7665723a706f6c69637900000000000000000000000000000000",
      ],
      returns: "address",
      property: "policy",
    });
  });
  test("governance test", () => {
    const obj = governance();
    expect(obj).toMatchObject({
      key: [
        "0x6e733a636f6e7472616374730000000000000000000000000000000000000000",
        "0x636e733a676f7600000000000000000000000000000000000000000000000000",
      ],
      returns: "address",
      property: "governance",
    });
  });
  test("stablecoin test", () => {
    const obj = stablecoin();
    expect(obj).toMatchObject({
      key: [
        "0x636e733a636f7665723a73630000000000000000000000000000000000000000",
      ],
      returns: "address",
      property: "stablecoin",
    });
  });
  test("vault test", () => {
    const obj = vault();
    expect(obj).toMatchObject({
      key: [
        "0x6e733a636f6e7472616374730000000000000000000000000000000000000000",
        "0x636e733a636f7665723a7661756c740000000000000000000000000000000000",
        undefined,
      ],
      returns: "address",
      property: "vault",
    });
  });
  test("priceDiscovery test", () => {
    const obj = priceDiscovery();
    expect(obj).toMatchObject({
      key: [
        "0x6e733a636f6e7472616374730000000000000000000000000000000000000000",
        "0x636e733a636f72653a70726963653a646973636f766572790000000000000000",
      ],
      returns: "address",
      property: "priceDiscovery",
    });
  });
});
