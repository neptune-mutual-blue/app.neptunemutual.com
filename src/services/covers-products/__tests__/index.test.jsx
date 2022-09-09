import { getNetworkId } from "@/src/config/environment";
import { getCoverData } from "@/src/services/covers-products";
import { mockFetch } from "@/utils/unit-tests/mockApiRequest";

describe("getCoverData function test", () => {
  test("should return null", async () => {
    global.fetch = jest.fn(mockFetch);

    let coverdata = await getCoverData(
      getNetworkId(),
      0x6262382d65786368616e67650000000000000000000000000000000000000000
    );
    console.log(coverdata);
    expect(coverdata).toBe(null);
  });
});
