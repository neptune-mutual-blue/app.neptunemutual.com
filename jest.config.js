const nextJest = require("next/jest");

const createJestConfig = nextJest();

const customJestConfig = {
  testMatch: ["**/*.test.js", "**/*.jsx", "**/*.test.ts", "**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  verbose: true,
  rootDir: ".",
  modulePaths: ["<rootDir>/lib"],
  transformIgnorePatterns: ["/next[/\\\\]dist/", "/\\.next/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/common/(.*)$": "<rootDir>/src/common/$1",
    "^@/modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/translations/(.*)$": "<rootDir>/src/translations/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/icons/(.*)$": "<rootDir>/src/icons/$1",
    "^@/src/(.*)$": "<rootDir>/src/$1",
  },
};

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
