const Addresses = require("@/src/services/contracts/getAddresses");
const { contracts } = require("@/utils/unit-tests/data/mockUpdata.data");
const { mockFetch } = require("@/utils/unit-tests/mockApiRequest");

const { getAddressesFromApi } = Addresses;

const { value: NPMTokenAddress } = contracts.data.find(
  (item) => item.key === "NPM"
);
const { value: liquidityTokenAddress } = contracts.data.find(
  (item) => item.key === "Stablecoin"
);

describe("Addresses test", () => {
  describe("getTokenSymbolAndDecimals test", () => {});

  describe("getAddressesFromApi test", () => {
    test("get address", async () => {
      global.fetch = jest.fn(mockFetch);

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

    test("get address return null because off reponse ok false", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: true }),
          ok: false,
        })
      );
      const result = await getAddressesFromApi(
        process.env.NEXT_PUBLIC_FALLBACK_NETWORK
      );

      expect(result).toBe(null);
    });

    test("get address return null because api throws an error", async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error("error")));
      const result = await getAddressesFromApi(
        process.env.NEXT_PUBLIC_FALLBACK_NETWORK
      );

      expect(result).toBe(null);
    });
  });
});
