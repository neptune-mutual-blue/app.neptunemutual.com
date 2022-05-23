// A default max-timeout of 90 seconds is allowed
// per test we should aim to bring this down though
jest.setTimeout(90 * 1000);

import "@testing-library/jest-dom/extend-expect";
import { loadEnvConfig } from "@next/env";

self.__NEXT_DATA__ = {};

loadEnvConfig(process.cwd());