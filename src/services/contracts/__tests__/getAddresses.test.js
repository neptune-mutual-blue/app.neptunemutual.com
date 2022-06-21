const {
  getAddressesFromApi,
} = require("@/src/services/contracts/getAddresses");
const { contracts } = require("@/utils/unit-tests/data/mockUpdata.data");
const { mockFetch } = require("@/utils/unit-tests/mockApiRequest");

const { value: NPMTokenAddress } = contracts.data.find(
  (item) => item.key === "NPM"
);
const { value: liquidityTokenAddress } = contracts.data.find(
  (item) => item.key === "Stablecoin"
);

describe("Get Address", () => {
  global.fetch = jest.fn(mockFetch);

  test("get address", async () => {
    const result = await getAddressesFromApi(
      process.env.NEXT_PUBLIC_FALLBACK_NETWORK
    );

    const expected = {
      NPMTokenAddress,
      liquidityTokenAddress,
      NPMTokenDecimals: 18,
      NPMTokenSymbol: "NPM",
      liquidityTokenDecimals: 6,
      liquidityTokenSymbol: "DAI",
    };

    expect(result).toStrictEqual(expected);
  });
});
