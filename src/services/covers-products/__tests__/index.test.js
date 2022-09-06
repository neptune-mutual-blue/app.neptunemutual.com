import { getCoverData } from "@/src/services/covers-products";
import * as subgraphService from "@/src/services/subgraph";

describe("Cover Products Service", () => {
  describe("getCoverData", () => {
    test("get address", async () => {
      jest
        .spyOn(subgraphService, "getSubgraphData")
        .mockImplementation(async () => ({
          cover: {
            id: "0x7832643200000000000000000000000000000000000000000000000000000000",
            coverKey:
              "0x7832643200000000000000000000000000000000000000000000000000000000",
            supportsProducts: false,
            ipfsHash: "Qmc8ei9ixDJd34dPLUu3bF9dcKU7XP2b7rb4DPJcnJb9Sj",
            ipfsData:
              '{\n  "key": "0x7832643200000000000000000000000000000000000000000000000000000000", "coverName": "X2D2 Exchange Cover"\n}',
            products: [],
          },
        }));

      const expected = {
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

      const result = await getCoverData(
        process.env.NEXT_PUBLIC_FALLBACK_NETWORK
      );

      expect(result).toStrictEqual(expected);
    });

    test("returns null when subgraph returns no data", async () => {
      jest
        .spyOn(subgraphService, "getSubgraphData")
        .mockImplementation(async () => null);

      const result = await getCoverData(
        process.env.NEXT_PUBLIC_FALLBACK_NETWORK
      );

      expect(result).toStrictEqual(null);
    });

    test("reverts when getSubgraphData rejects", async () => {
      jest
        .spyOn(subgraphService, "getSubgraphData")
        .mockImplementation(async () => {
          throw new Error("foobar");
        });

      expect(
        getCoverData(process.env.NEXT_PUBLIC_FALLBACK_NETWORK)
      ).rejects.toThrow("foobar");
    });
  });
});
