import { getCoverData } from "@/src/services/covers-products";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn } from "@/utils/unit-tests/test-mockup-fn";

describe("Cover Products Service", () => {
  const expectedData = {
    id: "0x7832643200000000000000000000000000000000000000000000000000000000",
    coverKey:
      "0x7832643200000000000000000000000000000000000000000000000000000000",
    supportsProducts: false,
    ipfsHash: "Qmc8ei9ixDJd34dPLUu3bF9dcKU7XP2b7rb4DPJcnJb9Sj",
    ipfsData:
      '{\n  "key": "0x7832643200000000000000000000000000000000000000000000000000000000", "coverName": "X2D2 Exchange Cover"\n}',
    infoObj: {
      about: undefined,
      blockchains: undefined,
      coverName: "X2D2 Exchange Cover",
      exclusions: undefined,
      leverage: undefined,
      links: undefined,
      pricingCeiling: undefined,
      pricingFloor: undefined,
      projectName: undefined,
      resolutionSources: undefined,
      rules: undefined,
      tags: undefined,
    },
    products: [],
  };

  describe("getCoverData", () => {
    test("get address", async () => {
      mockFn.getSubgraphData();

      const result = await getCoverData(testData.network.networkId);

      expect(result).toStrictEqual(expectedData);
    });

    test("returns null when subgraph returns no data", async () => {
      mockFn.getSubgraphData(() => null);

      const result = await getCoverData(testData.network.networkId);

      expect(result).toStrictEqual(null);
    });

    test("reverts when getSubgraphData rejects", async () => {
      mockFn.getSubgraphData(async () => {
        throw new Error("foobar");
      });

      expect(getCoverData(testData.network.networkId)).rejects.toThrow(
        "foobar"
      );
    });
  });
});
