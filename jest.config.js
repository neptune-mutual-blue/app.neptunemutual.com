const nextJest = require("next/jest");

const createJestConfig = nextJest();

const customJestConfig = {
  collectCoverageFrom: [
    "**/*.test.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/http/**",
    "!**/__tests__/**/component/**",
    "!**/__tests__/**/data/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  verbose: true,
  modulePaths: ["<rootDir>/lib"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i": "<rootDir>/__mocks__/fileMock.js",
    "^@/common/(.*)$": "<rootDir>/src/common/$1",
    "^@/modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/locales/(.*)$": "<rootDir>/locales/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/icons/(.*)$": "<rootDir>/src/icons/$1",
    "^@/src/(.*)$": "<rootDir>/src/$1",
    "^uuid$": require.resolve("uuid"),
  },
};

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);