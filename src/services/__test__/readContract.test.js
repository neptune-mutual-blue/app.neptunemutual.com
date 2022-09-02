import { contractRead } from "@/src/services/readContract";
import * as Bn from "@/utils/bn";

describe("contractRead test", () => {
  test("Should return nothing", async () => {
    const logger = jest.fn();
    const contract = await contractRead({
      instance: "",
      methodName: "foo",
      onError: logger,
    });
    expect(contract).toBe(undefined);
    expect(logger).toBeCalled();
  });

  test("Should return a proper result", async () => {
    const bN = jest.spyOn(Bn, "calculateGasMargin");
    const logger = jest.fn();

    const mockInstance = {
      foo: function () {
        return new Promise((resolve) => {
          resolve(15);
        });
      },
      estimateGas: {
        foo: function () {
          return new Promise((resolve) => {
            resolve(10);
          });
        },
      },
    };

    const contract = await contractRead({
      instance: mockInstance,
      methodName: "foo",
      onError: logger,
    });
    expect(bN).toHaveBeenCalled();
    expect(contract).toBe(15);
    expect(logger).not.toBeCalled();
  });

  test("Should return a proper result", async () => {
    const bN = jest.spyOn(Bn, "calculateGasMargin");
    const logger = jest.fn();

    const mockInstance = {
      foo: function () {
        return new Promise((resolve) => {
          resolve(undefined);
        });
      },
      estimateGas: {
        foo: function () {
          return new Promise((resolve) => {
            resolve(false);
          });
        },
      },
    };

    const contract = await contractRead({
      instance: mockInstance,
      methodName: "foo",
      onError: logger,
    });
    expect(bN).toHaveBeenCalled();
    expect(contract).toBe(undefined);
    expect(logger).not.toBeCalled();
  });

  test("Should return a proper result", async () => {
    const bN = jest.spyOn(Bn, "calculateGasMargin");

    const contract = await contractRead({
      instance: {},
      methodName: "foo",
    });
    expect(bN).toHaveBeenCalled();
    expect(contract).toBe(undefined);
  });
});
