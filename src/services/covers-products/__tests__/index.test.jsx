import { getNetworkId } from "@/src/config/environment";
import { getCoverData } from "@/src/services/covers-products";

describe("getCoverData function test", () => {
  test("should return data", async () => {
    let coverdata = await getCoverData(
      getNetworkId(),
      0x6262382d65786368616e67650000000000000000000000000000000000000000
    );

    console.log(coverdata);

    expect(coverdata).toBe(null);
  });
});
