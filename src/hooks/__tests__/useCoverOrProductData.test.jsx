import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { testData } from "@/utils/unit-tests/test-data";
import { mockFn, renderHookWrapper } from "@/utils/unit-tests/test-mockup-fn";

describe("useCoverOrProductData", () => {
  const { mock, mockFunction } = mockFn.consoleError();
  mockFn.useNetwork();

  test("should return null when invalid arguments passed", async () => {
    const args = [{ coverKey: "", productKey: "" }];

    const { result } = await renderHookWrapper(useCoverOrProductData, args);

    expect(result).toBeNull();
  });

  test("should return coverInfo as obtained from the 'getCoverOrProductData' function", async () => {
    const mockCoverInfo = { id: "1234", coverKey: "0x23453fgdfgdfgdf454" };
    mockFn.useCoversAndProducts(true, mockCoverInfo);

    const args = [
      {
        coverKey: testData.coverInfoWithProducts.coverKey,
        productKey: testData.coverInfoWithProducts.products[0].id,
      },
    ];
    const { result } = await renderHookWrapper(
      useCoverOrProductData,
      args,
      true
    );

    expect(result).toBe(mockCoverInfo);
  });

  test("should log error if error returned from api", async () => {
    mock();
    mockFn.useCoversAndProducts(false);

    const args = [
      {
        coverKey: testData.coverInfoWithProducts.coverKey,
        productKey: testData.coverInfoWithProducts.products[0].id,
      },
    ];
    const { result } = await renderHookWrapper(useCoverOrProductData, args);

    expect(result).toBeNull();
    expect(mockFunction).toHaveBeenCalled();
  });
});
